export const SelectTravelsList = [
    {
        id: '1',
        title: 'Một mình',
        desc: 'Tự mình khám phá mọi thứ',
        icon: '🛫',
        people: '1 People'
    },
    {
        id: '2',
        title: 'Người Yêu',
        desc: 'Hạnh phúc cùng nhau',
        icon: '🥂',
        people: '2 People'
    },
    {
        id: '3',
        title: 'Gia Đình',
        desc: 'Gắn kết gia đình',
        icon: '🏡',
        people: '3 to 6 People'
    },
    {
        id: '4',
        title: 'Bạn Bè',
        desc: 'Thắt chặt tình bạn',
        icon: '🛥',
        people: '5 to 10 People'
    },
]

export const SelectBudgetOption = [

    {
        id: '1',
        title: 'Tiết kiệm',
        desc: 'Từ 2 đến 4 triệu đồng',
        icon: '💸',
    },
    {
        id: '2',
        title: 'Trung bình',
        desc: 'Từ 5 đến 10 triệu đồng',
        icon: '💵',
    },
    {
        id: '3',
        title: 'Thoải mái',
        desc: 'Từ 10 đến 20 triệu',
        icon: '💰',
    },

]

export const AI_PROMPT =

    'Tạo cho tôi 1 bảng kế hoạch cho chuyến du lịch cùng với {traveler} ở {location} với mức chi tiêu {budget}, các lựa chọn khách sạn với HotelName, Hotel address, Price, hotel image url, tọa độ địa lí, rating, descriptions và những địa điểm gần đó có thể tham quan bao gồm placeName, Place Details, Place ImageUrl, tọa độ địa lý, giá vé tham quan (nếu có). Thời gian cho chuyế đi này là {totalDay} ngày {totalNight} đêm với kế hoạch của mỗi ngày là kế hoạch tốt nhất được xuất ra dưới dạng JSON. Ngôn ngữ sử dụng cho các value là tiếng Việt, còn key trong JSON thì dùng tiếng Anh'

export const DalatJson = [
    {
        "trip": {
            "duration": "2 ngày 2 đêm",
            "destination": "Thành phố Đà Lạt, tỉnh Lâm Đồng",
            "budget": "Thoải mái (từ 10 triệu đến 20 triệu)",
            "plan": [
                {
                    "day": "Ngày 1",
                    "morning": {
                        "activity": "Di chuyển đến Đà Lạt",
                        "accommodation": "Ana Mandara Villas Dalat",
                        "hotel": {
                            "HotelName": "Ana Mandara Villas Dalat",
                            "HotelAddress": "10 Trần Hưng Đạo, Phường 1, Thành phố Đà Lạt, tỉnh Lâm Đồng",
                            "Price": "Từ 3.000.000 VNĐ/đêm",
                            "hotelImageUrl": "https://www.anamondara.com/media/images/anamondara-villas-dalat/gallery/10.jpg",
                            "coordinates": "11.942829, 108.425656",
                            "rating": "4.5 sao",
                            "descriptions": "Khách sạn sang trọng với tầm nhìn đẹp, hồ bơi riêng, dịch vụ tuyệt vời.",
                            "nearbyPlaces": [
                                {
                                    "placeName": "Hồ Xuân Hương",
                                    "PlaceDetails": "Nơi dạo chơi thơ mộng với nhiều hoạt động giải trí như chèo thuyền, đạp vịt.",
                                    "PlaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Xu%C3%A2n_H%C6%B0%C6%A1ng_Lake%2C_Da_Lat%2C_Vietnam.jpg/1280px-Xu%C3%A2n_H%C6%B0%C6%A1ng_Lake%2C_Da_Lat%2C_Vietnam.jpg",
                                    "coordinates": "11.941628, 108.427503",
                                    "entranceFee": "Miễn phí"
                                },
                                {
                                    "placeName": "Vườn hoa Đà Lạt",
                                    "PlaceDetails": "Nơi ngắm hoa rực rỡ với nhiều loài hoa đẹp, thích hợp cho chụp ảnh.",
                                    "PlaceImageUrl": "https://media.lonelyplanet.com/images/articles/62624/thumbnail/Flower_Garden_in_Da_Lat_Vietnam.jpg",
                                    "coordinates": "11.943505, 108.426868",
                                    "entranceFee": "20.000 VNĐ/người lớn"
                                }
                            ]
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại Nhà hàng L'Angora",
                        "dining": "Nhà hàng L'Angora",
                        "diningDetails": {
                            "placeName": "Nhà hàng L'Angora",
                            "PlaceDetails": "Nhà hàng sang trọng với món ăn Âu Á tinh tế, view đẹp.",
                            "PlaceImageUrl": "https://www.dalatdiscovery.com/wp-content/uploads/2022/07/nha-hang-langora-dalat.jpg",
                            "coordinates": "11.943984, 108.425467",
                            "entranceFee": "Từ 200.000 VNĐ/người"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan Dinh Bảo Đại",
                        "attraction": "Dinh Bảo Đại",
                        "attractionDetails": {
                            "placeName": "Dinh Bảo Đại",
                            "PlaceDetails": "Biệt thự của vua Bảo Đại, nơi lưu giữ nhiều hiện vật lịch sử.",
                            "PlaceImageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bao_Dai_Palace_Da_Lat_2017.jpg/1280px-Bao_Dai_Palace_Da_Lat_2017.jpg",
                            "coordinates": "11.951844, 108.427219",
                            "entranceFee": "30.000 VNĐ/người lớn"
                        }
                    },
                    "evening": {
                        "activity": "Ăn tối tại Nhà hàng Gà nướng",
                        "dining": "Nhà hàng Gà nướng",
                        "diningDetails": {
                            "placeName": "Nhà hàng Gà nướng",
                            "PlaceDetails": "Nơi thưởng thức món gà nướng thơm ngon, đặc sản Đà Lạt.",
                            "PlaceImageUrl": "https://media.nomadicmatt.com/2018/06/grilled-chicken-dalat.jpg",
                            "coordinates": "11.943636, 108.427769",
                            "entranceFee": "Từ 100.000 VNĐ/người"
                        }
                    }
                },
                {
                    "day": "Ngày 2",
                    "morning": {
                        "activity": "Tham quan Thiền Viện Trúc Lâm",
                        "attraction": "Thiền Viện Trúc Lâm",
                        "attractionDetails": {
                            "placeName": "Thiền Viện Trúc Lâm",
                            "PlaceDetails": "Thiền viện nổi tiếng với kiến trúc độc đáo, khung cảnh thanh bình.",
                            "PlaceImageUrl": "https://www.dalatdiscovery.com/wp-content/uploads/2022/07/thien-vien-truc-lam-dalat-1.jpg",
                            "coordinates": "11.972197, 108.424538",
                            "entranceFee": "20.000 VNĐ/người lớn"
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại quán cơm niêu",
                        "dining": "Quán cơm niêu",
                        "diningDetails": {
                            "placeName": "Quán cơm niêu",
                            "PlaceDetails": "Quán cơm niêu ngon, bình dân, phục vụ các món ăn truyền thống.",
                            "PlaceImageUrl": "https://www.dalatdiscovery.com/wp-content/uploads/2021/04/com-ni%CC%82%C3%AAu-dalat.jpg",
                            "coordinates": "11.942216, 108.428752",
                            "entranceFee": "Từ 50.000 VNĐ/người"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan Lang Biang",
                        "attraction": "Lang Biang",
                        "attractionDetails": {
                            "placeName": "Lang Biang",
                            "PlaceDetails": "Núi cao với phong cảnh hùng vĩ, nơi lý tưởng để trekking, ngắm cảnh.",
                            "PlaceImageUrl": "https://media.nomadicmatt.com/2018/06/lang-biang-dalat.jpg",
                            "coordinates": "11.919484, 108.404240",
                            "entranceFee": "40.000 VNĐ/người lớn"
                        }
                    },
                    "evening": {
                        "activity": "Di chuyển về lại",
                        "accommodation": null
                    }
                }
            ]
        }
    }
]

export const HueJson = [
    {
        "trip": {
            "duration": "4 ngày 4 đêm",
            "destination": "Thành phố Huế, tỉnh Thừa Thiên Huế",
            "budget": "Bình thường (từ 5 triệu đến 10 triệu)",
            "plan": [
                {
                    "day": "Ngày 1",
                    "morning": {
                        "activity": "Di chuyển đến Huế",
                        "accommodation": "La Residence Hotel & Spa Hue",
                        "hotel": {
                            "HotelName": "La Residence Hotel & Spa Hue",
                            "HotelAddress": "15A Le Loi, Hue City, Thua Thien Hue Province",
                            "Price": "Từ 1.500.000 VNĐ/đêm",
                            "hotelImageUrl": "https://www.laresidencehue.com/media/images/gallery/4.jpg",
                            "coordinates": "16.468699, 107.603886",
                            "rating": "4 sao",
                            "descriptions": "Khách sạn boutique sang trọng với kiến trúc cổ điển, hồ bơi và spa.",
                            "nearbyPlaces": [
                                {
                                    "placeName": "Chợ Đông Ba",
                                    "PlaceDetails": "Chợ truyền thống sầm uất, nơi mua sắm các sản phẩm địa phương.",
                                    "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Hue_Market.jpg",
                                    "coordinates": "16.467418, 107.604347",
                                    "entranceFee": "Miễn phí"
                                },
                                {
                                    "placeName": "Sông Hương",
                                    "PlaceDetails": "Dòng sông thơ mộng chảy qua thành phố Huế, nơi lý tưởng cho dạo chơi, chèo thuyền.",
                                    "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Perfume-River-Hue-2.jpg",
                                    "coordinates": "16.467631, 107.604477",
                                    "entranceFee": "Miễn phí"
                                }
                            ]
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại quán cơm gia đình",
                        "dining": "Quán cơm gia đình",
                        "diningDetails": {
                            "placeName": "Quán cơm gia đình",
                            "PlaceDetails": "Nơi thưởng thức các món ăn truyền thống Huế với giá cả phải chăng.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_Street_Food-1.jpg",
                            "coordinates": "16.467656, 107.604077",
                            "entranceFee": "Từ 50.000 VNĐ/người"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan Đại Nội",
                        "attraction": "Đại Nội",
                        "attractionDetails": {
                            "placeName": "Đại Nội",
                            "PlaceDetails": "Khu vực Hoàng cung Huế, nơi lưu giữ nhiều di tích lịch sử và kiến trúc cổ.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Imperial-City-Hue.jpg",
                            "coordinates": "16.466451, 107.605572",
                            "entranceFee": "150.000 VNĐ/người lớn"
                        }
                    },
                    "evening": {
                        "activity": "Ăn tối tại quán bún bò Huế",
                        "dining": "Quán bún bò Huế",
                        "diningDetails": {
                            "placeName": "Quán bún bò Huế",
                            "PlaceDetails": "Nơi thưởng thức món bún bò Huế nổi tiếng, hương vị đậm đà.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_BunBoHue.jpg",
                            "coordinates": "16.467579, 107.603856",
                            "entranceFee": "Từ 40.000 VNĐ/bát"
                        }
                    }
                },
                {
                    "day": "Ngày 2",
                    "morning": {
                        "activity": "Tham quan Lăng Khải Định",
                        "attraction": "Lăng Khải Định",
                        "attractionDetails": {
                            "placeName": "Lăng Khải Định",
                            "PlaceDetails": "Lăng mộ của vua Khải Định, nổi tiếng với kiến trúc độc đáo, kết hợp giữa phong cách Á Âu.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Tomb-of-Khai-Dinh-Hue.jpg",
                            "coordinates": "16.480036, 107.604577",
                            "entranceFee": "100.000 VNĐ/người lớn"
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại nhà hàng chay",
                        "dining": "Nhà hàng chay",
                        "diningDetails": {
                            "placeName": "Nhà hàng chay",
                            "PlaceDetails": "Nơi thưởng thức các món chay ngon, thanh đạm.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_Vegetarian-Food.jpg",
                            "coordinates": "16.467295, 107.604735",
                            "entranceFee": "Từ 60.000 VNĐ/người"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan Cố đô Huế",
                        "attraction": "Cố đô Huế",
                        "attractionDetails": {
                            "placeName": "Cố đô Huế",
                            "PlaceDetails": "Khu vực di tích lịch sử với nhiều lăng tẩm, chùa chiền, nhà vườn cổ.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Hue_Imperial-City.jpg",
                            "coordinates": "16.465324, 107.605950",
                            "entranceFee": "Miễn phí"
                        }
                    },
                    "evening": {
                        "activity": "Tham gia Chợ đêm",
                        "attraction": "Chợ đêm",
                        "attractionDetails": {
                            "placeName": "Chợ đêm",
                            "PlaceDetails": "Nơi mua sắm, thưởng thức ẩm thực đường phố.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_Night-Market.jpg",
                            "coordinates": "16.467273, 107.604514",
                            "entranceFee": "Miễn phí"
                        }
                    }
                },
                {
                    "day": "Ngày 3",
                    "morning": {
                        "activity": "Tham quan Lăng Tự Đức",
                        "attraction": "Lăng Tự Đức",
                        "attractionDetails": {
                            "placeName": "Lăng Tự Đức",
                            "PlaceDetails": "Lăng mộ của vua Tự Đức, nổi tiếng với cảnh quan thơ mộng, hồ nước trong xanh.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Tomb-of-Tu-Duc-Hue.jpg",
                            "coordinates": "16.498524, 107.605176",
                            "entranceFee": "60.000 VNĐ/người lớn"
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại quán bún hến",
                        "dining": "Quán bún hến",
                        "diningDetails": {
                            "placeName": "Quán bún hến",
                            "PlaceDetails": "Nơi thưởng thức món bún hến độc đáo, vị ngọt thanh.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_BunHen.jpg",
                            "coordinates": "16.467478, 107.604548",
                            "entranceFee": "Từ 30.000 VNĐ/tô"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan chùa Thiên Mụ",
                        "attraction": "Chùa Thiên Mụ",
                        "attractionDetails": {
                            "placeName": "Chùa Thiên Mụ",
                            "PlaceDetails": "Ngôi chùa cổ kính, nằm trên đồi Hà Khê, với kiến trúc độc đáo.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/ThienMu-Pagoda-Hue.jpg",
                            "coordinates": "16.481899, 107.613340",
                            "entranceFee": "Miễn phí"
                        }
                    },
                    "evening": {
                        "activity": "Tham gia Chương trình biểu diễn Ca Huế",
                        "attraction": "Chương trình biểu diễn Ca Huế",
                        "attractionDetails": {
                            "placeName": "Chương trình biểu diễn Ca Huế",
                            "PlaceDetails": "Thể hiện nét đẹp văn hóa truyền thống Huế, với các bài hát, điệu múa cổ.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Hue_CaHue.jpg",
                            "coordinates": "16.468723, 107.605044",
                            "entranceFee": "Từ 200.000 VNĐ/người"
                        }
                    }
                },
                {
                    "day": "Ngày 4",
                    "morning": {
                        "activity": "Tham quan Lăng Minh Mạng",
                        "attraction": "Lăng Minh Mạng",
                        "attractionDetails": {
                            "placeName": "Lăng Minh Mạng",
                            "PlaceDetails": "Lăng mộ của vua Minh Mạng, nổi tiếng với cảnh quan đẹp, kiến trúc hài hòa.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Tomb-of-Minh-Mang-Hue.jpg",
                            "coordinates": "16.469102, 107.616352",
                            "entranceFee": "80.000 VNĐ/người lớn"
                        }
                    },
                    "noon": {
                        "activity": "Ăn trưa tại quán bún thịt nướng",
                        "dining": "Quán bún thịt nướng",
                        "diningDetails": {
                            "placeName": "Quán bún thịt nướng",
                            "PlaceDetails": "Nơi thưởng thức món bún thịt nướng thơm ngon, đậm đà.",
                            "PlaceImageUrl": "https://cdn.vietnamdiscovery.com/uploads/images/Hue_BunThitNuong.jpg",
                            "coordinates": "16.467712, 107.604146",
                            "entranceFee": "Từ 40.000 VNĐ/tô"
                        }
                    },
                    "afternoon": {
                        "activity": "Tham quan cầu Trường Tiền",
                        "attraction": "Cầu Trường Tiền",
                        "attractionDetails": {
                            "placeName": "Cầu Trường Tiền",
                            "PlaceDetails": "Cây cầu sắt bắc qua sông Hương, biểu tượng của thành phố Huế.",
                            "PlaceImageUrl": "https://www.vietnamdiscovery.com/uploads/images/Truong-Tien-Bridge-Hue.jpg",
                            "coordinates": "16.468048, 107.604177",
                            "entranceFee": "Miễn phí"
                        }
                    },
                    "evening": {
                        "activity": "Di chuyển về lại",
                        "accommodation": null
                    }
                }
            ]
        }
    }
]