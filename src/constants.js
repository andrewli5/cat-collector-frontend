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
  mala: "malayan.png",
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
};

export const CATICON_TO_BREEDID = {};
for (const [breedId, catIcon] of Object.entries(BREEDID_TO_CATICON)) {
  CATICON_TO_BREEDID[catIcon] = breedId;
}

export const RARITY_TO_COLOR = {
  C: "gray",
  U: "green",
  R: "red",
  E: "purple",
  L: "yellow",
};
