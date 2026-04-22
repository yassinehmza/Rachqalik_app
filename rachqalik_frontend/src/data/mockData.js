const qualities = ['good', 'good', 'average', 'bad', 'good', 'average', 'good']

/* ── Users ────────────────────────────────────────────────── */

export const MOCK_USER = {
  id: '64abc123def456789012345',
  name: 'Karim Benali',
  email: 'karim@example.com',
  plan: 'free',
  role: 'user',
  createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
}

export const MOCK_PREMIUM_USER = {
  id: '64abc456def789012345678',
  name: 'Sara El Fassi',
  email: 'sara@example.com',
  plan: 'premium',
  role: 'user',
  createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
}

export const MOCK_ADMIN = {
  id: '64abc000def000000000001',
  name: 'Haitam BEN LAMSAGUEM',
  email: 'admin@rachqalik.ma',
  plan: 'premium',
  role: 'admin',
  createdAt: new Date('2024-01-01').toISOString(),
}

/* ── Shop catalogue ───────────────────────────────────────── */

// Every Rachqalik pillow contains the same smart core:
// embedded sleep sensors + app sync. These categories represent
// the comfort profile / sleeper preference, not different products.
export const PRODUCT_CATEGORIES = [
  { slug: 'hot-sleeper',  label: 'Hot Sleepers'      },
  { slug: 'eco',          label: 'Eco & Organic'      },
  { slug: 'anti-snore',   label: 'Anti-Snore'         },
  { slug: 'pain-relief',  label: 'Neck & Back Relief' },
  { slug: 'adjustable',   label: 'Adjustable Comfort' },
  { slug: 'ultra-soft',   label: 'Ultra Soft'         },
  { slug: 'pro',          label: 'Pro / Flagship'     },
]

export const MOCK_PRODUCTS = [
  {
    _id: 'prod001',
    name: 'Rachqalik Flex',
    price: 899,
    description:
      'The most versatile model in the Rachqalik lineup. The smart core tracks your sleep stages, breathing rate, and movement throughout the night and sends a full report to the app each morning. The outer chamber uses shredded memory foam you can add or remove via the hidden zipper — dial in your exact loft and firmness whether you are a back sleeper, side sleeper, or switch between both. CertiPUR-US and GREENGUARD Gold certified.',
    image: '/products/adjustable_pillow.jpg',
    stock: 143,
    category: 'adjustable',
    rating: 4.8,
    reviewCount: 2847,
    bestSeller: true,
  },
  {
    _id: 'prod002',
    name: 'Rachqalik Bamboo',
    price: 699,
    description:
      'Built for sleepers who run warm and have sensitive skin. The Rachqalik smart sensor array sits invisibly beneath a breathable bamboo-viscose cover that absorbs 40% more moisture than cotton and stays naturally cool. The app detects your peak temperature spikes and cross-references them with your restless-movement data — so you can finally understand why you wake up at 3 AM. Medium-firm fill. 100-night trial included.',
    image: '/products/Cambridge-Pillow-bamboo_naturel.jpg',
    stock: 88,
    category: 'hot-sleeper',
    rating: 4.6,
    reviewCount: 634,
    bestSeller: false,
  },
  {
    _id: 'prod003',
    name: 'Rachqalik Cervix',
    price: 759,
    description:
      'Designed with physiotherapists for people who wake up with neck or shoulder pain. The contoured memory foam has two loft zones — high side for shoulder sleepers, low side for back sleepers — that automatically keep your cervical spine in neutral alignment. The embedded sensors monitor your head position shifts through the night and flag the positions correlated with your worst-quality sleep. Bamboo cover, machine-washable.',
    image: '/products/comfort_back.webp',
    stock: 112,
    category: 'pain-relief',
    rating: 4.6,
    reviewCount: 891,
    bestSeller: false,
  },
  {
    _id: 'prod004',
    name: 'Rachqalik Ice',
    price: 999,
    description:
      'The Rachqalik model made for hot sleepers who need active cooling, not just breathable fabric. A phase-change gel panel on the sleep surface keeps the pillow up to 6°C cooler than standard foam for a full 8-hour cycle. The smart sensors log your skin-temperature fluctuations alongside your sleep stages, so the app can correlate heat spikes with your light-sleep periods. OEKO-TEX Standard 100 certified.',
    image: '/products/cooling_pillow.webp',
    stock: 57,
    category: 'hot-sleeper',
    rating: 4.8,
    reviewCount: 1243,
    bestSeller: true,
  },
  {
    _id: 'prod005',
    name: 'Rachqalik Zen',
    price: 2999,
    description:
      'The most advanced pillow Rachqalik makes. An embedded microphone array detects snoring in real time and silently activates micro-air chambers to reposition your head by 5–12°, opening the airway before you or your partner ever wake up. Clinical study: snoring reduced by up to 89%. In the morning, the app shows you a full snore-event timeline, sleep-stage breakdown, heart-rate trend, and breathing consistency score. For people who are serious about fixing their sleep.',
    image: '/products/derucci-anti-snore-pillow-2.webp',
    stock: 19,
    category: 'anti-snore',
    rating: 4.4,
    reviewCount: 187,
    bestSeller: false,
  },
  {
    _id: 'prod006',
    name: 'Rachqalik Green',
    price: 1199,
    description:
      'For eco-conscious sleepers who want smart tracking without synthetic materials. The Rachqalik sensor module is embedded in a shell made entirely from GOLS-certified organic latex and ethically-sourced kapok fiber — nothing synthetic, no off-gassing, no chemical finishes. The app tracks your sleep quality over weeks and shows you exactly how your organic sleep environment compares to population averages. GOTS and GREENGUARD Gold certified.',
    image: '/products/organic_pillow.webp',
    stock: 46,
    category: 'eco',
    rating: 4.7,
    reviewCount: 523,
    bestSeller: false,
  },
  {
    _id: 'prod007',
    name: 'Rachqalik Cloud',
    price: 1249,
    description:
      'Hotel-level luxury with Rachqalik intelligence inside. The microdenier down-alternative fill gives you the cloud-like sink of goose down — fully hypoallergenic and vegan — while the hidden smart layer logs your sleep stages, heart rate variability, and movement patterns every night. The app surfaces a weekly Sleep Score with actionable tips. 100% organic cotton cover with satin-piped finish. Choose Standard Loft or High Loft at checkout. 45-night free return.',
    image: '/products/saatva-down-alternative-pillow-product-pic.webp',
    stock: 34,
    category: 'ultra-soft',
    rating: 4.6,
    reviewCount: 312,
    bestSeller: false,
  },
]

/* ── Orders ───────────────────────────────────────────────── */

export const MOCK_ORDERS = [
  {
    _id: 'ord001',
    userId: '64abc123def456789012345',
    products: [
      { productId: 'prod001', name: 'Coop Adjustable Fill Pillow', quantity: 1, price: 899 },
    ],
    total: 899,
    status: 'shipped',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord002',
    userId: '64abc123def456789012345',
    products: [
      { productId: 'prod004', name: 'CoolFlow Gel Memory Foam Pillow', quantity: 1, price: 999 },
      { productId: 'prod002', name: 'Cambridge Bamboo Pillow',         quantity: 1, price: 699 },
    ],
    total: 1698,
    status: 'paid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_ALL_ORDERS = [
  ...MOCK_ORDERS,
  {
    _id: 'ord003',
    userId: '64abc456def789012345678',
    products: [
      { productId: 'prod005', name: 'DeRUCCI Anti-Snore Smart Pillow', quantity: 1, price: 2999 },
    ],
    total: 2999,
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord004',
    userId: '64abc888def000000000888',
    products: [
      { productId: 'prod006', name: 'Avocado Organic Kapok Pillow', quantity: 2, price: 1199 },
    ],
    total: 2398,
    status: 'shipped',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'ord005',
    userId: '64abc777def000000000777',
    products: [
      { productId: 'prod007', name: 'Saatva Plush Down Alternative Pillow', quantity: 1, price: 1249 },
      { productId: 'prod003', name: 'ErgoComfort Cervical Support Pillow',  quantity: 1, price: 759  },
    ],
    total: 2008,
    status: 'paid',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

/* ── Sleep logs ───────────────────────────────────────────── */

export const MOCK_SLEEP = Array.from({ length: 21 }, (_, i) => ({
  _id: `sleep${i}`,
  userId: '64abc123def456789012345',
  duration: parseFloat((5.5 + Math.random() * 3.5).toFixed(1)),
  quality: qualities[i % qualities.length],
  date: new Date(Date.now() - (20 - i) * 24 * 60 * 60 * 1000).toISOString(),
}))
