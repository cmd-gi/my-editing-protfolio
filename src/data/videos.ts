export type VideoRatio = "9:16" | "16:9" | "1:1";

export type VideoCategory =
  | "real-estate"
  | "restaurant"
  | "promo"
  | "clinic"
  | "catering"
  | "school"
  | "motion-graphics";

export interface VideoItem {
  id: string;
  src: string;
  title: string;
  category: VideoCategory;
  ratio: VideoRatio;
}

export const VIDEO_CATEGORIES: { id: "all" | VideoCategory; label: string }[] = [
  { id: "all", label: "All Videos" },
  { id: "real-estate", label: "Real Estate" },
  { id: "restaurant", label: "Restaurant & Food" },
  { id: "promo", label: "Brand & Promos" },
  { id: "clinic", label: "Healthcare & Clinic" },
  { id: "catering", label: "Catering & Hospitality" },
  { id: "school", label: "School & Events" },
  { id: "motion-graphics", label: "Motion Graphics" },
];

/**
 * TOGGLE ARRANGE / EDIT MODE FEATURE
 * Set this to `false` whenever you want to disable and hide the web reorder/editing mode.
 */
export const ENABLE_ARRANGE_MODE = false;

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    "id": "vid-10",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463839/Dental_reel_R18_clinic.mp4",
    "title": "Dental Clinic Reel 18",
    "category": "clinic",
    "ratio": "9:16"
  },
  {
    "id": "vid-28",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208044/Sociofy_Reel_3_3_promo.mp4",
    "title": "Sociofy Reel 03",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-22",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208111/Real_Estate_4_topaz.mp4",
    "title": "Real Estate Topaz 04",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-26",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208072/Siddiq_8_2_resturent.mp4",
    "title": "Siddiq Restaurant 08",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-09",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463846/Al-Zaatar_Reel_13_restrorent.mp4",
    "title": "Al-Zaatar Restaurant 13",
    "category": "restaurant",
    "ratio": "16:9"
  },
  {
    "id": "vid-21",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208113/Dental_reel_R16_clinic.mp4",
    "title": "Dental Clinic Reel 16",
    "category": "clinic",
    "ratio": "9:16"
  },
  {
    "id": "vid-29",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207971/Reel_12_resturent.mp4",
    "title": "Restaurant Reel 12",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-34",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207816/Siddiq_7_resturent.mp4",
    "title": "Siddiq Restaurant 07",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-32",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207901/Real_Estate_3_2.mp4",
    "title": "Real Estate Showcase 03",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-35",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207718/Real_Estate_2_v1.mp4",
    "title": "Real Estate Showcase 02",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-08",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463853/Siddiq_1_2_resturent.mp4",
    "title": "Siddiq Restaurant 01",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-01",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463916/Founders_promo.mp4",
    "title": "Founders Promo",
    "category": "promo",
    "ratio": "16:9"
  },
  {
    "id": "vid-02",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463911/Socioify_Final_4_promo.mp4",
    "title": "Socioify Final 04",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-03",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463906/Final_video_6_promo.mp4",
    "title": "Commercial Cut 06",
    "category": "promo",
    "ratio": "16:9"
  },
  {
    "id": "vid-04",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463904/St_Joseph_Reel_14_1_school.mp4",
    "title": "St. Joseph Reel 14",
    "category": "school",
    "ratio": "9:16"
  },
  {
    "id": "vid-05",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463892/Real_Estate_7_Final_Without_Number.mp4",
    "title": "Real Estate Showcase 07",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-06",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463870/Spice_of_asia_3_promo_1.mp4",
    "title": "Spice of Asia Promo 03",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-07",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463864/Real_Estate_5.mp4",
    "title": "Real Estate Tour 05",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-11",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463838/Real_Estate_8_2.mp4",
    "title": "Real Estate Showcase 08",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-12",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463797/Dental_Horizontal_clinic.mp4",
    "title": "Dental Clinic Feature (Horizontal)",
    "category": "clinic",
    "ratio": "16:9"
  },
  {
    "id": "vid-13",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463793/Real_Estate_6_1.mp4",
    "title": "Real Estate Tour 06",
    "category": "real-estate",
    "ratio": "9:16"
  },
  {
    "id": "vid-14",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463786/Sociofy_Landra_1_promo.mp4",
    "title": "Sociofy Landra Promo",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-15",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463739/Dental_reel_R19_1_clinic.mp4",
    "title": "Dental Clinic Reel 19",
    "category": "clinic",
    "ratio": "9:16"
  },
  {
    "id": "vid-16",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793463726/Ak_Caters_reel_2.mp4",
    "title": "AK Caters Reel 02",
    "category": "catering",
    "ratio": "9:16"
  },
  {
    "id": "vid-17",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208154/Ak_Catres_4.mp4",
    "title": "AK Caters Reel 04",
    "category": "catering",
    "ratio": "9:16"
  },
  {
    "id": "vid-18",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208155/FK_Cateres_Reel_5_1.mp4",
    "title": "FK Caterers Reel 05",
    "category": "catering",
    "ratio": "9:16"
  },
  {
    "id": "vid-19",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208142/Reel_2_4_resturent.mp4",
    "title": "Restaurant Reel 02",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-20",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208136/Spice_of_asia_2_restrorent.mp4",
    "title": "Spice of Asia Reel 02",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-23",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208109/FK_Cateres_Reel_7_1.mp4",
    "title": "FK Caterers Reel 07",
    "category": "catering",
    "ratio": "9:16"
  },
  {
    "id": "vid-24",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208105/Reel_1_resturent.mp4",
    "title": "Restaurant Reel 01",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-25",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208072/Dental_reel_R14_1_clinic.mp4",
    "title": "Dental Clinic Reel 14",
    "category": "clinic",
    "ratio": "9:16"
  },
  {
    "id": "vid-27",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793208069/Dental_reel_R12_1_clinic.mp4",
    "title": "Dental Clinic Reel 12",
    "category": "clinic",
    "ratio": "9:16"
  },
  {
    "id": "vid-30",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207955/AL_Zatar_Reel_resturent.mp4",
    "title": "Al-Zaatar Reel",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-31",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207910/St_Joseph_Reel_15_school.mp4",
    "title": "St. Joseph Reel 15",
    "category": "school",
    "ratio": "9:16"
  },
  {
    "id": "vid-33",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207879/St_Joseph_Reel_19_1_school.mp4",
    "title": "St. Joseph Reel 19",
    "category": "school",
    "ratio": "9:16"
  },
  {
    "id": "vid-36",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207664/Siddiq_6_1_resturent.mp4",
    "title": "Siddiq Restaurant 06",
    "category": "restaurant",
    "ratio": "9:16"
  },
  {
    "id": "vid-37",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207377/Motion_1_final_motion_grpahics.mp4",
    "title": "Motion Graphics Cut 01",
    "category": "motion-graphics",
    "ratio": "9:16"
  },
  {
    "id": "vid-38",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207304/Socify_International_1_motion_grphics.mp4",
    "title": "Sociofy Motion Cut",
    "category": "motion-graphics",
    "ratio": "16:9"
  },
  {
    "id": "vid-39",
    "src": "https://res.cloudinary.com/dzdrs3ig9/video/upload/v1793207293/Al-Zaatar_reel_3_restrorent.mp4",
    "title": "Al-Zaatar Restaurant 03",
    "category": "restaurant",
    "ratio": "16:9"
  },
  {
    "id": "vid-40",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955971/Final_Draft_3_xtgsqt.mp4",
    "title": "Final Draft 03",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-41",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955912/Sanchi_c1_ge74wi.mp4",
    "title": "Sanchi Cut 01",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-42",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1779079702/e_tpkvuf.mp4",
    "title": "Creative Edit E",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-43",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955733/Manvith_1_f7amco.mp4",
    "title": "Manvith Commercial",
    "category": "promo",
    "ratio": "16:9"
  },
  {
    "id": "vid-44",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/v1781955666/d1_mullug.mp4",
    "title": "Story Edit D1",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-45",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956579/NEWEST_viral_editing_style_Linked_Comp_01_rmsbrz.mp4",
    "title": "Viral Style Cut",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-46",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1779079788/Sanchi_2_nc_jqberd.mp4",
    "title": "Sanchi Cut 02",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-47",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956482/class2_pxvdph.mp4",
    "title": "Classroom Session 02",
    "category": "school",
    "ratio": "16:9"
  },
  {
    "id": "vid-48",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781956260/Shot_2_pvun8l.mp4",
    "title": "Cinematic Shot 02",
    "category": "promo",
    "ratio": "16:9"
  },
  {
    "id": "vid-49",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955841/Classic_350_dt91un.mp4",
    "title": "Royal Enfield Classic 350",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-50",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955724/Sanchi_3_r2675i.mp4",
    "title": "Sanchi Cut 03",
    "category": "promo",
    "ratio": "9:16"
  },
  {
    "id": "vid-51",
    "src": "https://res.cloudinary.com/drjczsj9l/video/upload/q_auto/f_auto/v1781955760/w_Walk_ow6x6a.mp4",
    "title": "Walk Lifestyle Cut",
    "category": "promo",
    "ratio": "9:16"
  }
];
