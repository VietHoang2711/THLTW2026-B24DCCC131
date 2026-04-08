export interface Destination {
  id: string;
  title: string;
  type: 'beach' | 'mountain' | 'city';
  image: string;
  price: number; // base price for visit
  rating: number;
  durationMins: number;
  costBreakdown: {
    food: number;
    transport: number;
    lodging: number;
  };
}

export const DEFAULT_DESTINATIONS: Destination[] = [
  { id: 'd1', title: 'Nha Trang', type: 'beach', image: 'https://images.unsplash.com/photo-1533002832-1721d16b4bb9?q=80&w=1878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', price: 120, rating: 4.6, durationMins: 240, costBreakdown: { food: 30, transport: 20, lodging: 70 } },
  { id: 'd2', title: 'Sapa', type: 'mountain', image: 'https://img.thuthuatphanmem.vn/uploads/2018/09/26/hinh-anh-sa-pa-thi-xa-trong-suong_052042440.jpg', price: 100, rating: 4.7, durationMins: 300, costBreakdown: { food: 25, transport: 30, lodging: 45 } },
  { id: 'd3', title: 'Hồ Chí Minh', type: 'city', image: 'https://th.bing.com/th/id/R.c173e501cff6d1c20ef24e4915715b7f?rik=tYQp5UbbluiIVg&pid=ImgRaw&r=0', price: 80, rating: 4.4, durationMins: 180, costBreakdown: { food: 35, transport: 15, lodging: 30 } },
  { id: 'd4', title: 'Hà Nội', type: 'city', image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-ha-noi.jpg', price: 90, rating: 4.5, durationMins: 200, costBreakdown: { food: 30, transport: 20, lodging: 40 } },
  { id: 'd5', title: 'Hội An', type: 'city', image: 'https://th.bing.com/th/id/R.d793262b76d7be554eb7d74a03d75e0b?rik=OnAnK4pYfpBmCg&riu=http%3a%2f%2fadmin.vn-tourism.com%2fIMAGE_MANAGER_CACHE_PATH%2ffb%2ffbfa29_hoi-an-t.jpg&ehk=jG6mRmbuMyznTLCZAstWlVv7Fc8pSszhp2Xt7LO1nhA%3d&risl=&pid=ImgRaw&r=0', price: 70, rating: 4.8, durationMins: 180, costBreakdown: { food: 25, transport: 10, lodging: 35 } },
  { id: 'd6', title: 'Đà Nẵng', type: 'beach', image: 'https://img5.thuthuatphanmem.vn/uploads/2022/01/13/hinh-anh-thanh-pho-da-nang-ve-dem-dep_024513140.jpg', price: 95, rating: 4.6, durationMins: 240, costBreakdown: { food: 28, transport: 18, lodging: 49 } },
  { id: 'd7', title: 'Đà Lạt', type: 'mountain', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/2a/93/55/ta-van-homestay.jpg?w=700&h=-1&s=1', price: 85, rating: 4.7, durationMins: 220, costBreakdown: { food: 27, transport: 20, lodging: 38 } },
  { id: 'd8', title: 'Mũi Né', type: 'beach', image: 'https://th.bing.com/th/id/R.cbbde7c57a1cf4fe861f7a3592eacbe6?rik=csVlWS5JN%2boq3A&pid=ImgRaw&r=0', price: 60, rating: 4.3, durationMins: 180, costBreakdown: { food: 20, transport: 15, lodging: 25 } },
  { id: 'd9', title: 'Phú Quốc', type: 'beach', image: 'https://edenlandscape.vn/wp-content/uploads/2020/06/Eden-Landscape-thiet-ke-canh-quan-sunser-town-7.jpg', price: 130, rating: 4.8, durationMins: 300, costBreakdown: { food: 40, transport: 30, lodging: 60 } },
  { id: 'd10', title: 'Vườn Quốc Gia Cát Bà', type: 'mountain', image: 'https://ticotravel.com.vn/wp-content/uploads/2022/05/Vuon-quoc-gia-Cat-Ba-3.jpg', price: 75, rating: 4.4, durationMins: 260, costBreakdown: { food: 22, transport: 18, lodging: 35 } },
  { id: 'd11', title: 'Ninh Bình', type: 'mountain', image: 'https://onevivu.vn/wp-content/uploads/2020/10/Du-lich-Tam-Coc-Ninh-Binh-3.jpg', price: 65, rating: 4.6, durationMins: 200, costBreakdown: { food: 20, transport: 15, lodging: 30 } },
  { id: 'd12', title: 'Côn Đảo', type: 'beach', image: 'https://tse3.mm.bing.net/th/id/OIP.asQnMteZfTvjxDsMRKmgDgHaE7?rs=1&pid=ImgDetMain&o=7&rm=3', price: 140, rating: 4.7, durationMins: 320, costBreakdown: { food: 45, transport: 35, lodging: 60 } },
  { id: 'd13', title: 'Vũng Tàu', type: 'beach', image: 'https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20v%C5%A9ng%20t%C3%A0u/anh-dep-vung-tau-thumbnail.jpg', price: 50, rating: 4.0, durationMins: 150, costBreakdown: { food: 18, transport: 12, lodging: 20 } },
  { id: 'd14', title: 'Cần Thơ', type: 'city', image: 'https://ik.imagekit.io/tvlk/blog/2022/09/kinh-nghiem-du-lich-can-tho-1.jpg?tr=dpr-2,w-675', price: 55, rating: 4.1, durationMins: 160, costBreakdown: { food: 20, transport: 12, lodging: 25 } },
  { id: 'd15', title: 'Huế', type: 'city', image: 'https://tse3.mm.bing.net/th/id/OIP.SQzSFaXXiOzRuxUvbN_DNgHaDo?rs=1&pid=ImgDetMain&o=7&rm=3', price: 68, rating: 4.5, durationMins: 190, costBreakdown: { food: 24, transport: 14, lodging: 30 } },
];
