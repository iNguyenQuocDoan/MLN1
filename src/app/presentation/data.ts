export type Section = {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  quote?: { text: string; author?: string };
  note?: string;
  highlight?: string;
  keyPoints?: string[];
  comparison?: { before: string[]; after: string[] };
  interactive?: "poll";
  image?: { src: string; alt: string };
};

export const SECTIONS: Section[] = [
  {
    id: "csht",
    title: "Cơ sở hạ tầng trong học thuyết Mác – Lênin",
    subtitle: "Nền tảng kinh tế của xã hội",
    content: [
      "Cơ sở hạ tầng là toàn bộ quan hệ sản xuất hợp thành cơ cấu kinh tế của xã hội. CSHT không đồng nhất với cơ sở vật chất kỹ thuật (đường xá, nhà cửa).",
    ],
    keyPoints: [
      "Quan hệ sở hữu tư liệu sản xuất",
      "Quan hệ tổ chức, quản lý sản xuất",
      "Quan hệ phân phối sản phẩm lao động",
    ],
    note: '"Ăn – ở – mặc – đi lại" là những nhu cầu gắn trực tiếp với sản xuất vật chất, vì vậy chúng thuộc về CSHT, không phải KTTT.',
    image: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Công nhân và máy móc tượng trưng sản xuất",
    },
  },
  {
    id: "kttt",
    title: "Kiến trúc thượng tầng",
    subtitle: "Đời sống tinh thần của xã hội",
    content: [
      "Kiến trúc thượng tầng bao gồm toàn bộ các hình thái ý thức xã hội (chính trị, pháp luật, đạo đức, nghệ thuật, tôn giáo, triết học…) cùng các thiết chế xã hội tương ứng (Nhà nước, đảng phái, tổ chức chính trị – xã hội).",
    ],
    highlight: "Nhà nước là bộ phận trung tâm và có sức tác động mạnh nhất trong KTTT.",
    image: {
      src: "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1200&q=80",
      alt: "Tòa nhà chính phủ tượng trưng thiết chế",
    },
  },
  {
    id: "bienChung1",
    title: "CSHT quyết định KTTT",
    subtitle: "Chiều thứ nhất của quan hệ biện chứng",
    content: [
      "Cơ sở hạ tầng quyết định sự ra đời, nội dung, tính chất và sự vận động, biến đổi của Kiến trúc thượng tầng. Kinh tế thế nào thì tư tưởng và thiết chế thế ấy.",
      "Khi nhu cầu vật chất cơ bản chưa được đảm bảo, con người không thể toàn tâm cho các hoạt động tinh thần. Đây là quy luật lịch sử, không phải sự phủ nhận giá trị tinh thần.",
    ],
    keyPoints: [
      "Quyết định sự ra đời của KTTT",
      "Quyết định nội dung và tính chất của KTTT",
      "Quyết định sự vận động, biến đổi của KTTT",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      alt: "Bánh răng và bóng đèn tượng trưng kinh tế quyết định ý thức",
    },
  },
  {
    id: "bienChung2",
    title: "KTTT tác động trở lại CSHT",
    subtitle: "Chiều thứ hai của quan hệ biện chứng",
    content: [
      "Kiến trúc thượng tầng có chức năng bảo vệ, củng cố và phát triển cơ sở hạ tầng đã sinh ra nó. KTTT tác động trở lại CSHT thông qua pháp luật, chính sách và bộ máy quản lý nhà nước.",
    ],
    highlight: "Luật phù hợp → thúc đẩy sản xuất. Luật cứng nhắc → kìm hãm phát triển.",
    note: "Ví dụ: Kinh tế số Việt Nam – CSHT mới (công nghệ số, nền tảng số) đòi hỏi KTTT mới (luật thương mại điện tử, chính sách chuyển đổi số).",
    image: {
      src: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      alt: "Tòa nhà quốc hội tượng trưng chính sách",
    },
  },
  {
    id: "vietnam",
    title: "Thực tiễn Việt Nam sau Đổi mới 1986",
    subtitle: "Minh chứng sống động cho học thuyết Marx",
    content: [
      "Quá trình Đổi mới tại Việt Nam là minh chứng rõ ràng nhất cho quy luật biện chứng giữa CSHT và KTTT mà Marx đã chỉ ra.",
    ],
    comparison: {
      before: [
        "CSHT thấp, sản xuất kém hiệu quả",
        "Đời sống vật chất khó khăn",
        "KTTT cứng nhắc, sáng tạo hạn chế",
      ],
      after: [
        "CSHT phát triển, kinh tế thị trường định hướng XHCN",
        "Đời sống vật chất nâng cao rõ rệt",
        "Pháp luật, giáo dục, văn hóa đổi mới mạnh mẽ",
      ],
    },
    image: {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      alt: "Việt Nam đổi mới",
    },
  },
  {
    id: "sinhVien",
    title: "Học thuyết Marx trong đời sống sinh viên",
    subtitle: "Micro-Marxism – Áp dụng ở cấp độ cá nhân",
    content: [
      "CSHT cá nhân bao gồm: thu nhập, học phí, chi phí sinh hoạt. Khi CSHT chưa ổn định, tư duy bị kéo về vấn đề sinh tồn. Khi CSHT được đảm bảo, con người mới có thể phát triển tri thức, sáng tạo và nghiên cứu.",
    ],
    quote: {
      text: "Không phải sinh viên thiếu năng lực, mà là điều kiện vật chất chưa cho phép.",
    },
    image: {
      src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      alt: "Sinh viên học tập",
    },
  },
  {
    id: "interactive",
    title: "Bạn là nhà hoạch định chính sách",
    subtitle: "Tình huống thực tiễn",
    content: [
      "Một quốc gia còn nghèo, kinh tế yếu, có nên đầu tư hàng nghìn tỷ đồng xây dựng các công trình văn hóa hoành tráng (nhà hát, bảo tàng) không?",
    ],
    interactive: "poll",
    image: {
      src: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1200&q=80",
      alt: "Nhà hát hiện đại tượng trưng đầu tư văn hóa",
    },
  },
  {
    id: "ketLuan",
    title: "Kết luận",
    subtitle: "Thông điệp phương pháp luận",
    content: [
      "Nhận định của Marx không hạ thấp tinh thần; nó khẳng định nền kinh tế vững là điều kiện để xây dựng đời sống tinh thần cao đẹp.",
      "Phương pháp luận cho sinh viên: muốn làm khoa học, chính trị, cống hiến xã hội → trước hết học nghề vững, tham gia tốt vào sản xuất vật chất.",
    ],
    quote: {
      text: "Muốn xây dựng đời sống tinh thần cao đẹp, xã hội trước hết phải có nền tảng kinh tế vững chắc.",
    },
    highlight: "Đây chính là giá trị cốt lõi của Học thuyết hình thái kinh tế – xã hội.",
    image: {
      src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      alt: "Sách và ánh sáng tượng trưng tri thức",
    },
  },
];
