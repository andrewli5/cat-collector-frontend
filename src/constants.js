export const APP_NAME = "cat collector";
export const CAT_API_KEY =
  "live_VlKOzc3U7YxQZLBU4kkFMkS0LqnyaHzXq6B7LGTopTf4yPrwLhvKOMlnDO3YG64n";
export const LOCAL_API_URL = "http://localhost:4000/api";
export const CAT_API_URL_BREEDS = "https://api.thecatapi.com/v1/breeds";
export const CAT_API_URL_IMAGE =
  "https://api.thecatapi.com/v1/images/search?breed_ids=";
export const CAT_API_URL_IMAGES =
  "https://api.thecatapi.com/v1/images/search?limit=10&breed_ids={}&api_key=" +
  CAT_API_KEY;

export const BREEDID_TO_CATICON = {
  abys: "abyssinian.png",
  aege: "aegean.png",
  abob: "american_bobtail.png",
  acur: "american_curl.png",
  asho: "american_shorthair.png",
  awir: "american_wirehair.png",
  amau: "arabian_mau.png",
  amis: "australian_mist.png",
  bali: "balinese.png",
  bamb: "bambino.png",
  beng: "bengal.png",
  birm: "birman.png",
  bomb: "bombay.png",
  bslo: "british_longhair.png",
  bsho: "british_shorthair.png",
  bure: "burmese.png",
  buri: "burmilla.png",
  cspa: "california_spangled.png",
  ctif: "chantilly-tiffany.png",
  char: "chartreux.png",
  chau: "chausie.png",
  chee: "cheetoh.png",
  csho: "colorpoint_shorthair.png",
  crex: "cornish_rex.png",
  cymr: "cymric.png",
  cypr: "cyprus.png",
  drex: "devon_rex.png",
  dons: "donskoy.png",
  lihu: "dragon_li.png",
  emau: "egyptian_mau.png",
  ebur: "european_burmese.png",
  esho: "exotic_shorthair.png",
  hbro: "havana_brown.png",
  hima: "himalayan.png",
  jbob: "japanese_bobtail.png",
  java: "javanese.png",
  khao: "khao_manee.png",
  kora: "korat_cat.png",
  kuri: "kurilian_cat.png",
  kral: "kornish_rex.png",
  lape: "laperm.png",
  mcoo: "maine_coon.png",
  manx: "manx.png",
  munc: "munchkin.png",
  nebe: "nebelung.png",
  norw: "norwegian_forest.png",
  ocic: "ocicat.png",
  orie: "oriental.png",
  pers: "persian.png",
  pixi: "pixie-bob.png",
  raga: "ragamuffin.png",
  ragd: "ragdoll.png",
  rblu: "russian_blue.png",
  sava: "savannah.png",
  sfol: "scottish_fold.png",
  siam: "siamese.png",
  sibe: "siberian.png",
  sing: "singapura.png",
  snow: "snowshoe.png",
  soma: "somali.png",
  srex: "selkirk_rex.png",
  sphy: "sphynx.png",
  tang: "turkish_angora.png",
  tonk: "tonkinese.png",
  toyg: "toyger.png",
  tvan: "turkish_van.png",
  ycho: "york_chocolate.png",
  rory: "rory.jpg",
  mimi: "mimi.jpg"
};

export const CATICON_TO_BREEDID = {};
for (const [breedId, catIcon] of Object.entries(BREEDID_TO_CATICON)) {
  CATICON_TO_BREEDID[catIcon] = breedId;
}

export const RARITY_TO_COLOR = {
  C: "rgba(255, 255, 255, 1)",
  U: "rgba(0, 128, 0, 1)",
  R: "blue",
  E: "rgba(128, 0, 128, 1)",
  L: "rgba(255, 255, 0, 1)",
  M: "gold",
};

export const RARITY_TO_STRING = {
  C: "Common",
  U: "Uncommon",
  R: "Rare",
  E: "Epic",
  L: "Legendary",
  M: "Mythic",
};

export const RARITY_TO_VALUE = {
  C: 1,
  U: 2,
  R: 3,
  E: 4,
  L: 5,
  M: 6,
};

export const UPGRADES = {
  LUCK1: "Luck of the Draw I",
  LUCK2: "Luck of the Draw II",
  LUCK3: "Luck of the Draw III",
  CRIT1: "Purrfect Rolls I",
  CRIT2: "Purrfect Rolls II",
  CRIT3: "Purrfect Rolls III",
  COIN1: "Coin Collector I",
  COIN2: "Coin Collector II",
  COIN3: "Coin Collector III",
  COST1: "Cost Reduction I",
  COST2: "Cost Reduction II",
  COST3: "Cost Reduction III",
};
