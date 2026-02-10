export const containers = {
  tr: [
    {
      id: '20dc',
      category: 'standard_cargo',
      name: "20' DC Kuru Yük Konteyneri",
      type: '20DC',
      dimensions: {
        external: { length: 6.06, width: 2.44, height: 2.59 },
        internal: { length: 5.90, width: 2.35, height: 2.39 },
      },
      capacity: {
        volume: 33.2,
        maxGross: 30480,
        tareWeight: 2300,
        maxPayload: 28180,
      },
      features: ['Yeni/sıfır', 'ISO standartları', 'Dayanıklı çelik yapı'],
      image: '/images/containers/20dc.jpg',
    },
    {
      id: '40hc',
      category: 'standard_cargo',
      name: "40' HC Kuru Yük Konteyneri",
      type: '40HC',
      dimensions: {
        external: { length: 12.19, width: 2.44, height: 2.90 },
        internal: { length: 12.03, width: 2.35, height: 2.70 },
      },
      capacity: {
        volume: 76.3,
        maxGross: 30480,
        tareWeight: 3900,
        maxPayload: 26580,
      },
      features: ['Yeni/sıfır', 'High cube', 'Geniş iç hacim'],
      image: '/images/containers/40hc.jpg',
    },
    {
      id: '40rf',
      category: 'refrigerated',
      name: "40' HC Buzdolabı Konteyneri",
      type: '40RF',
      dimensions: {
        external: { length: 12.19, width: 2.44, height: 2.90 },
        internal: { length: 11.56, width: 2.29, height: 2.55 },
      },
      capacity: {
        volume: 67.5,
        maxGross: 34000,
        tareWeight: 4800,
        maxPayload: 29200,
      },
      features: [
        'Sıcaklık kontrolü: -30°C ile +30°C',
        'Carrier marka kompresör',
        'Dijital kontrol paneli',
        'Yeni/sıfır',
      ],
      image: '/images/containers/40rf.jpg',
    },
  ],
  en: [
    {
      id: '20dc',
      category: 'standard_cargo',
      name: "20' DC Dry Cargo Container",
      type: '20DC',
      dimensions: {
        external: { length: 6.06, width: 2.44, height: 2.59 },
        internal: { length: 5.90, width: 2.35, height: 2.39 },
      },
      capacity: {
        volume: 33.2,
        maxGross: 30480,
        tareWeight: 2300,
        maxPayload: 28180,
      },
      features: ['New/unused', 'ISO standards', 'Durable steel construction'],
      image: '/images/containers/20dc.jpg',
    },
    {
      id: '40hc',
      category: 'standard_cargo',
      name: "40' HC Dry Cargo Container",
      type: '40HC',
      dimensions: {
        external: { length: 12.19, width: 2.44, height: 2.90 },
        internal: { length: 12.03, width: 2.35, height: 2.70 },
      },
      capacity: {
        volume: 76.3,
        maxGross: 30480,
        tareWeight: 3900,
        maxPayload: 26580,
      },
      features: ['New/unused', 'High cube', 'Large internal volume'],
      image: '/images/containers/40hc.jpg',
    },
    {
      id: '40rf',
      category: 'refrigerated',
      name: "40' HC Refrigerated Container",
      type: '40RF',
      dimensions: {
        external: { length: 12.19, width: 2.44, height: 2.90 },
        internal: { length: 11.56, width: 2.29, height: 2.55 },
      },
      capacity: {
        volume: 67.5,
        maxGross: 34000,
        tareWeight: 4800,
        maxPayload: 29200,
      },
      features: [
        'Temperature control: -30°C to +30°C',
        'Carrier brand compressor',
        'Digital control panel',
        'New/unused',
      ],
      image: '/images/containers/40rf.jpg',
    },
  ],
};
