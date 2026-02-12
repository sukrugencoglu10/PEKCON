---
description: Geliştirme sunucusunu başlat ve tarayıcıda aç
---

# Tarayıcıda Projeyi Aç

Bu workflow geliştirme sunucusunu başlatır ve tarayıcıda otomatik olarak açar.

## Adımlar

// turbo-all

1. Eğer sunucu çalışmıyorsa, geliştirme sunucusunu başlat:

```bash
npm run dev
```

2. Tarayıcıda localhost:3000'i aç:

```bash
start http://localhost:3000
```

## Kullanım

Sadece "tarayıcıda aç" veya "projeyi aç" deyin, bu workflow otomatik olarak çalışacaktır.

## Cache Sorunları İçin

Eğer değişiklikler tarayıcıda görünmüyorsa:

- Hard refresh: `Ctrl + Shift + R`
- Veya gizli pencerede aç: `Ctrl + Shift + N` sonra `localhost:3000`
