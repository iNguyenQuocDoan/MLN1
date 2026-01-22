import type { Card, PropertyGroup, Tile } from "@/lib/types";

// Fast mode: giới hạn lượt để phù hợp slot ~15 phút
export const MAX_TURNS = 10;
// Đua vòng: đạt số vòng này trước (hoặc hết lượt) sẽ chốt xếp hạng
export const TARGET_LAPS = 3;
export const STARTING_CASH = 1500;
export const GO_SALARY = 200;
export const CRISIS_BAIL = 200;

export const propertyGroups: PropertyGroup[] = [
  {
    id: 1,
    name: "Nhu cầu cơ bản (Thực phẩm)",
    colorClass: "bg-gradient-to-r from-amber-500 to-orange-600",
    tier: "low",
  },
  {
    id: 2,
    name: "Nhu cầu cơ bản (Chỗ ở)",
    colorClass: "bg-gradient-to-r from-orange-500 to-red-500",
    tier: "low",
  },
  {
    id: 3,
    name: "Công nghiệp",
    colorClass: "bg-gradient-to-r from-red-500 to-rose-600",
    tier: "mid",
  },
  {
    id: 4,
    name: "Thượng tầng (Khoa học/Nghệ thuật)",
    colorClass: "bg-gradient-to-r from-blue-500 to-indigo-600",
    tier: "high",
  },
];

/**
 * Small MVP board (16 tiles).
 * Indices include special tiles inspired by Monopoly.
 */
export const tiles: Tile[] = [
  { index: 0, type: "GO", name: "GO", description: "Nhận lương" },
  {
    index: 1,
    type: "PROPERTY",
    name: "Hợp tác xã Bánh mì",
    groupId: 1,
    price: 100,
    buildCost: 50,
    baseRent: 12,
    rentPerUpgrade: 18,
    maxUpgrades: 3,
  },
  {
    index: 2,
    type: "INFRASTRUCTURE_CARD",
    name: "Hạ tầng",
    description: "Điều kiện vật chất thay đổi. Rút 1 lá.",
  },
  {
    index: 3,
    type: "PROPERTY",
    name: "Nông trại Cộng đồng",
    groupId: 1,
    price: 120,
    buildCost: 60,
    baseRent: 14,
    rentPerUpgrade: 20,
    maxUpgrades: 3,
  },
  {
    index: 4,
    type: "PROPERTY",
    name: "Khu nhà Công nhân",
    groupId: 2,
    price: 140,
    buildCost: 70,
    baseRent: 16,
    rentPerUpgrade: 24,
    maxUpgrades: 3,
  },
  {
    index: 5,
    type: "LUCKY",
    name: "Ô May Mắn",
    description: "May mắn đến! Nhận hiệu ứng ngẫu nhiên.",
  },
  {
    index: 6,
    type: "PROPERTY",
    name: "Nghiệp đoàn Nhà tập thể",
    groupId: 2,
    price: 160,
    buildCost: 80,
    baseRent: 18,
    rentPerUpgrade: 26,
    maxUpgrades: 3,
  },
  {
    index: 7,
    type: "PROPERTY",
    name: "Nhà máy Thép",
    groupId: 3,
    price: 200,
    buildCost: 100,
    baseRent: 24,
    rentPerUpgrade: 36,
    maxUpgrades: 3,
  },
  {
    index: 8,
    type: "SOCIAL_WELFARE",
    name: "Phúc lợi xã hội",
    description: "Nghỉ ngơi ngắn. Không hành động (MVP).",
  },
  {
    index: 9,
    type: "PROPERTY",
    name: "Hội đồng Nhà máy",
    groupId: 3,
    price: 220,
    buildCost: 110,
    baseRent: 26,
    rentPerUpgrade: 40,
    maxUpgrades: 3,
  },
  {
    index: 10,
    type: "ECONOMIC_CRISIS",
    name: "Khủng hoảng kinh tế",
    description: "Mắc kẹt trong quan liêu. Bỏ lượt trừ khi trả bảo lãnh.",
  },
  {
    index: 11,
    type: "PROPERTY",
    name: "Đại học Nhân dân",
    groupId: 4,
    price: 260,
    buildCost: 130,
    baseRent: 30,
    rentPerUpgrade: 50,
    maxUpgrades: 3,
  },
  {
    index: 12,
    type: "LUCKY",
    name: "Ô May Mắn",
    description: "May mắn đến! Nhận hiệu ứng ngẫu nhiên.",
  },
  {
    index: 13,
    type: "PROPERTY",
    name: "Công xã Nghệ thuật",
    groupId: 4,
    price: 280,
    buildCost: 140,
    baseRent: 32,
    rentPerUpgrade: 54,
    maxUpgrades: 3,
  },
  {
    index: 14,
    type: "GO_TO_CRISIS",
    name: "Đi đến Khủng hoảng",
    description: "Di chuyển tới ô Khủng hoảng kinh tế (10).",
  },
  {
    index: 15,
    type: "PROPERTY",
    name: "Cục Văn hóa",
    groupId: 4,
    price: 300,
    buildCost: 150,
    baseRent: 34,
    rentPerUpgrade: 58,
    maxUpgrades: 3,
  },
];

export const infrastructureDeck: Card[] = [
  {
    id: "infra-harvest",
    deck: "infrastructure",
    title: "Mùa vụ bội thu",
    body: "Vật chất dồi dào, đời sống cải thiện.",
    effect: { kind: "cash", amount: 100 },
  },
  {
    id: "infra-flood",
    deck: "infrastructure",
    title: "Lũ lụt",
    body: "Hạ tầng hư hại, tài nguyên căng thẳng.",
    effect: { kind: "cash", amount: -50 },
  },
  {
    id: "infra-machinery",
    deck: "infrastructure",
    title: "Máy móc mới",
    body: "Năng suất tăng, mâu thuẫn cũng tăng.",
    effect: { kind: "cash", amount: 75 },
  },
];

export const superstructureDeck: Card[] = [
  {
    id: "super-education",
    deck: "superstructure",
    title: "Cải cách giáo dục",
    body: "Tri thức lan tỏa. Tiền thuê tăng tạm thời.",
    effect: { kind: "rentMultiplier", multiplier: 1.2, turns: 3 },
  },
  {
    id: "super-bureaucracy",
    deck: "superstructure",
    title: "Quan liêu",
    body: "Trì hoãn hành chính. Mất 1 lượt.",
    effect: { kind: "skipTurns", turns: 1 },
  },
  {
    id: "super-solidarity",
    deck: "superstructure",
    title: "Chiến dịch đoàn kết",
    body: "Hành động tập thể tăng sức mặc cả.",
    effect: { kind: "cash", amount: 50 },
  },
];

