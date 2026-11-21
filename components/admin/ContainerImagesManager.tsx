'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ImagePlus,
  Trash2,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Images,
  Star,
  X,
  Check,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import {
  CONTAINER_IMAGE_TYPES,
  type ContainerImageMeta,
  type ContainerImageTypeKey,
} from '@/lib/container-image-types';

type GroupedImages = Record<ContainerImageTypeKey, ContainerImageMeta[]>;

async function compressImage(file: File): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return file;
  if (file.size <= 350 * 1024) return file;

  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1400;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '');
          resolve(new File([blob], `${baseName}.webp`, { type: 'image/webp' }));
        },
        'image/webp',
        0.82
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export default function ContainerImagesManager() {
  const [images, setImages] = useState<GroupedImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<ContainerImageTypeKey | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingCoverId, setSettingCoverId] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragTargetId, setDragTargetId] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/container-images', { cache: 'no-store' });
      if (!res.ok) throw new Error('Görseller alınamadı.');
      const data = await res.json();
      setImages(data.images);
    } catch {
      setNotice({ type: 'error', text: 'Görseller yüklenirken bir hata oluştu.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (!activeType) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveType(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeType]);

  const activeConfig = activeType
    ? CONTAINER_IMAGE_TYPES.find((c) => c.key === activeType) ?? null
    : null;
  const activeList = activeType && images ? images[activeType] ?? [] : [];

  const handleUpload = async (typeKey: ContainerImageTypeKey, fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (rawFiles.length === 0) {
      setNotice({ type: 'error', text: 'Lütfen yalnızca resim dosyası (JPG, PNG, WebP) seçin.' });
      return;
    }

    setUploading(true);
    setNotice(null);

    try {
      const compressed = await Promise.all(rawFiles.map(compressImage));
      const formData = new FormData();
      formData.append('containerType', typeKey);
      compressed.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/admin/container-images', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Yükleme başarısız.');
      }

      setImages((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [typeKey]: [...(prev[typeKey] ?? []), ...(data.uploaded as ContainerImageMeta[])],
        };
      });

      setNotice({
        type: 'success',
        text: `${data.uploaded.length} görsel eklendi ve canlı sayfada yayınlandı.`,
      });
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Görseller yüklenemedi.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (typeKey: ContainerImageTypeKey, id: number) => {
    setDeletingId(id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/container-images?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Silinemedi.');
      }
      setImages((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [typeKey]: (prev[typeKey] ?? []).filter((img) => img.id !== id),
        };
      });
      setNotice({ type: 'success', text: 'Görsel silindi ve canlı sayfa güncellendi.' });
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Görsel silinemedi.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleReorder = async (
    typeKey: ContainerImageTypeKey,
    newList: ContainerImageMeta[]
  ) => {
    const prevList = images?.[typeKey] ?? [];
    setImages((prev) => (prev ? { ...prev, [typeKey]: newList } : prev));
    setReordering(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/container-images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerType: typeKey,
          orderedIds: newList.map((item) => item.id),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Sıralama kaydedilemedi.');
      }
      setNotice({ type: 'success', text: 'Fotoğraf sırası güncellendi ve canlı sayfaya yansıtıldı.' });
    } catch (err) {
      setImages((prev) => (prev ? { ...prev, [typeKey]: prevList } : prev));
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Sıralama kaydedilemedi.',
      });
    } finally {
      setReordering(false);
    }
  };

  const handleMove = (typeKey: ContainerImageTypeKey, index: number, delta: -1 | 1) => {
    const list = images?.[typeKey] ?? [];
    const target = index + delta;
    if (target < 0 || target >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    void handleReorder(typeKey, copy);
  };

  const handleDropReorder = (typeKey: ContainerImageTypeKey, targetId: number) => {
    if (draggedId === null || draggedId === targetId) return;
    const list = images?.[typeKey] ?? [];
    const fromIdx = list.findIndex((i) => i.id === draggedId);
    const toIdx = list.findIndex((i) => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const copy = [...list];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    setDraggedId(null);
    setDragTargetId(null);
    void handleReorder(typeKey, copy);
  };

  const handleSetCover = async (typeKey: ContainerImageTypeKey, id: number) => {
    setSettingCoverId(id);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/container-images', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ containerType: typeKey, coverId: id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Kapak görseli güncellenemedi.');
      }
      setImages((prev) => {
        if (!prev) return prev;
        const list = prev[typeKey] ?? [];
        const picked = list.find((item) => item.id === id);
        if (!picked) return prev;
        return {
          ...prev,
          [typeKey]: [picked, ...list.filter((item) => item.id !== id)],
        };
      });
      setNotice({ type: 'success', text: 'Kapak görseli güncellendi ve canlı sayfaya yansıtıldı.' });
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Kapak görseli güncellenemedi.',
      });
    } finally {
      setSettingCoverId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Üst bilgilendirme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-6 py-4">
        <div className="text-sm text-slate-600 leading-relaxed">
          Düzenlemek istediğiniz konteyner kutusunda <strong className="text-slate-900">Resim Ekle</strong> butonuna basın.
          Fotoğraf ekleyebilir, kapak görselini seçebilir veya tek tek silebilirsiniz.
        </div>
        <a
          href="/tr/satilik-konteyner"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold whitespace-nowrap transition-colors shrink-0"
        >
          <ExternalLink size={15} />
          Canlı Sayfayı Gör
        </a>
      </div>

      {/* Genel durum mesajı (modal kapalıyken) */}
      {notice && !activeType && (
        <div
          className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
          )}
          <span>{notice.text}</span>
        </div>
      )}

      {/* Kompakt ve simetrik kart ızgarası */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 flex items-center justify-center gap-3 text-slate-500 text-sm">
          <Loader2 size={20} className="animate-spin text-[#0069b4]" />
          Görseller yükleniyor...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONTAINER_IMAGE_TYPES.map((ct) => {
            const list = images?.[ct.key] ?? [];
            const coverSrc = list[0]?.url ?? ct.defaultImage;

            return (
              <div
                key={ct.key}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all overflow-hidden flex flex-col"
              >
                {/* Tek kapak görseli — tüm kutular eşit yükseklikte */}
                <button
                  type="button"
                  onClick={() => {
                    setNotice(null);
                    setActiveType(ct.key);
                  }}
                  className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden group text-left"
                >
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={ct.label}
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-[1.03] ${
                        list.length > 0 ? 'object-cover' : 'object-contain p-3 bg-white'
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <Images size={26} />
                      <span className="text-xs font-medium">Görsel yok</span>
                    </div>
                  )}

                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/75 text-white text-[11px] font-semibold backdrop-blur-sm">
                    <Images size={12} />
                    {list.length > 0 ? `${list.length} resim` : ct.defaultImage ? 'Varsayılan' : '0 resim'}
                  </span>
                </button>

                {/* Kompakt alt bilgi + buton */}
                <div className="p-4 flex items-center justify-between gap-3 mt-auto border-t border-slate-100">
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{ct.label}</h2>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {list.length > 0 ? 'Kapak seçili • Yayında' : 'Fotoğraf bekleniyor'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotice(null);
                      setActiveType(ct.key);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0069b4] hover:bg-[#005490] text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
                  >
                    <ImagePlus size={14} />
                    Resim Ekle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ön plana yükselen düzenleme penceresi (Modal) */}
      {activeType && activeConfig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4"
          onClick={() => setActiveType(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeConfig.label} görselleri`}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Modal başlık */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/70">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {activeConfig.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Birden fazla fotoğraf yükleyebilir, kapak resmini tek tıkla seçebilir veya silebilirsiniz.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveType(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal gövde */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {notice && (
                <div
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium ${
                    notice.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {notice.type === 'success' ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  )}
                  <span>{notice.text}</span>
                </div>
              )}

              {/* Çoklu yükleme / sürükle-bırak alanı */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files?.length) {
                    handleUpload(activeType, e.dataTransfer.files);
                  }
                }}
                className={`flex flex-col items-center justify-center gap-2 py-7 px-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
                  dragOver
                    ? 'border-[#0069b4] bg-[#0069b4]/5'
                    : 'border-slate-300 bg-slate-50/70 hover:border-[#0069b4] hover:bg-slate-50'
                } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={26} className="animate-spin text-[#0069b4]" />
                    <span className="text-sm font-semibold text-slate-700">
                      Fotoğraflar sıkıştırılıp yükleniyor...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-xl bg-[#0069b4]/10 text-[#0069b4] flex items-center justify-center">
                      <UploadCloud size={22} />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      Fotoğraf seçin veya buraya sürükleyip bırakın
                    </div>
                    <div className="text-xs text-slate-500">
                      JPG, PNG, WebP • Tek seferde birden fazla fotoğraf seçebilirsiniz
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleUpload(activeType, e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
              </label>

              {/* Yüklü fotoğraflar + Kapak seçimi + Silme */}
              {activeList.length > 0 ? (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Yüklü Fotoğraflar ({activeList.length})
                    </h4>
                    <span className="text-xs text-slate-400">
                      Sürükleyip bırakarak veya oklarla sıralayın • 1. sıra kapak görselidir
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {activeList.map((img, idx) => {
                      const isCover = idx === 0;
                      const isSettingCover = settingCoverId === img.id;
                      const isDeleting = deletingId === img.id;
                      const isDragging = draggedId === img.id;
                      const isDropTarget = dragTargetId === img.id && draggedId !== img.id;

                      return (
                        <div
                          key={img.id}
                          draggable={!reordering && activeList.length > 1}
                          onDragStart={() => setDraggedId(img.id)}
                          onDragOver={(e) => {
                            if (draggedId !== null) {
                              e.preventDefault();
                              if (dragTargetId !== img.id) setDragTargetId(img.id);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragTargetId === img.id) setDragTargetId(null);
                          }}
                          onDrop={(e) => {
                            if (draggedId !== null) {
                              e.preventDefault();
                              handleDropReorder(activeType, img.id);
                            }
                          }}
                          onDragEnd={() => {
                            setDraggedId(null);
                            setDragTargetId(null);
                          }}
                          className={`rounded-xl overflow-hidden bg-white border transition-all flex flex-col ${
                            isDropTarget
                              ? 'border-[#0069b4] ring-2 ring-[#0069b4]/40 scale-[1.02]'
                              : isCover
                              ? 'border-[#0069b4] ring-2 ring-[#0069b4]/25 shadow-sm'
                              : 'border-slate-200'
                          } ${isDragging ? 'opacity-45' : ''} ${
                            activeList.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''
                          }`}
                        >
                          <div className="relative aspect-[4/3] bg-slate-100">
                            <img
                              src={img.url}
                              alt={`${activeConfig.label} #${idx + 1}`}
                              className="w-full h-full object-cover pointer-events-none select-none"
                            />
                            <span
                              className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold shadow-sm ${
                                isCover ? 'bg-[#0069b4]' : 'bg-slate-900/75'
                              }`}
                            >
                              {isCover ? (
                                <>
                                  <Check size={11} strokeWidth={3} />
                                  1 • Kapak
                                </>
                              ) : (
                                `#${idx + 1}`
                              )}
                            </span>
                            {activeList.length > 1 && (
                              <span
                                title="Sıralamak için sürükleyin"
                                className="absolute top-2 right-2 p-1 rounded-md bg-slate-900/60 text-white/90"
                              >
                                <GripVertical size={13} />
                              </span>
                            )}
                          </div>

                          <div className="p-2 space-y-1.5 border-t border-slate-100 bg-slate-50/50">
                            {activeList.length > 1 && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={idx === 0 || reordering}
                                  onClick={() => handleMove(activeType, idx, -1)}
                                  title="Sola taşı"
                                  className="flex-1 inline-flex items-center justify-center gap-0.5 py-1 px-2 rounded-lg text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft size={13} />
                                  Öne
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === activeList.length - 1 || reordering}
                                  onClick={() => handleMove(activeType, idx, 1)}
                                  title="Sağa taşı"
                                  className="flex-1 inline-flex items-center justify-center gap-0.5 py-1 px-2 rounded-lg text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                                >
                                  Sona
                                  <ChevronRight size={13} />
                                </button>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={isCover || isSettingCover || reordering}
                                onClick={() => handleSetCover(activeType, img.id)}
                                className={`flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-colors ${
                                  isCover
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                    : 'bg-white hover:bg-[#0069b4] hover:text-white text-slate-700 border border-slate-200'
                                }`}
                              >
                                {isSettingCover ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : isCover ? (
                                  <>
                                    <Check size={12} strokeWidth={2.5} />
                                    Kapak
                                  </>
                                ) : (
                                  <>
                                    <Star size={12} />
                                    Kapak Yap
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                disabled={isDeleting || reordering}
                                onClick={() => handleDelete(activeType, img.id)}
                                title="Bu resmi sil"
                                className="inline-flex items-center justify-center gap-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-rose-600 bg-white hover:bg-rose-600 hover:text-white border border-slate-200 hover:border-rose-600 transition-colors disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Trash2 size={12} />
                                )}
                                Sil
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  Bu konteyner için henüz özel fotoğraf eklenmedi.
                </div>
              )}
            </div>

            {/* Modal alt çubuk — Tamam butonu */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Değişiklikler anında kaydedilir ve canlı sayfada yayınlanır.
              </span>
              <button
                type="button"
                onClick={() => setActiveType(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <Check size={16} />
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
