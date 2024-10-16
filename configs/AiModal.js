/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
    export const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "Tạo cho tôi 1 bảng kế hoạch cho chuyến du lịch cùng với Người yêu ở Thành phố Đà Lạt, tỉnh Lâm Đồng với mức chi tiêu Thoải mái (từ 10 triệu đến 20 triệu), các lựa chọn khách sạn với HotelName, Hotel address, Price, hotel image url, tọa độ địa lí, rating, descriptions và những địa điểm gần đó có thể tham quan bao gồm placeName, Place Details, Place ImageUrl, tọa độ địa lý, giá vé tham quan (nếu có). Thời gian cho chuyế đi này là 2 ngày 2 đêm với kế hoạch của mỗi ngày là kế hoạch tốt nhất được xuất ra dưới dạng JSON. Ngôn ngữ sử dụng là tiếng Việt"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"chuyến_du_lịch\": {\n    \"thời_gian\": \"2 ngày 2 đêm\",\n    \"địa_điểm\": \"Đà Lạt, Lâm Đồng\",\n    \"mức_chi_tiêu\": \"Thoải mái (10 triệu - 20 triệu)\",\n    \"kế_hoạch\": [\n      {\n        \"ngày\": \"Ngày 1\",\n        \"sáng\": {\n          \"hoạt_động\": \"Di chuyển đến Đà Lạt\",\n          \"nơi_ở\": \"Khách sạn Ana Mandara Villas Dalat\",\n          \"khách_sạn\": {\n            \"HotelName\": \"Ana Mandara Villas Dalat\",\n            \"Hotel address\": \"10 Tran Hung Dao, Ward 1, Da Lat City, Lam Dong Province\",\n            \"Price\": \"Từ 3.000.000 VNĐ/đêm\",\n            \"hotel image url\": \"https://www.anamondara.com/media/images/anamondara-villas-dalat/gallery/10.jpg\",\n            \"tọa độ địa lí\": \"11.942829, 108.425656\",\n            \"rating\": \"4.5 sao\",\n            \"descriptions\": \"Khách sạn sang trọng với tầm nhìn đẹp, hồ bơi riêng, dịch vụ tuyệt vời.\",\n            \"địa_điểm_gần_đó\": [\n              {\n                \"placeName\": \"Hồ Xuân Hương\",\n                \"Place Details\": \"Nơi dạo chơi thơ mộng với nhiều hoạt động giải trí như chèo thuyền, đạp vịt.\",\n                \"Place ImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Xu%C3%A2n_H%C6%B0%C6%A1ng_Lake%2C_Da_Lat%2C_Vietnam.jpg/1280px-Xu%C3%A2n_H%C6%B0%C6%A1ng_Lake%2C_Da_Lat%2C_Vietnam.jpg\",\n                \"tọa độ địa lý\": \"11.941628, 108.427503\",\n                \"giá_vé\": \"Miễn phí\"\n              },\n              {\n                \"placeName\": \"Vườn hoa Đà Lạt\",\n                \"Place Details\": \"Nơi ngắm hoa rực rỡ với nhiều loài hoa đẹp, thích hợp cho chụp ảnh.\",\n                \"Place ImageUrl\": \"https://media.lonelyplanet.com/images/articles/62624/thumbnail/Flower_Garden_in_Da_Lat_Vietnam.jpg\",\n                \"tọa độ địa lý\": \"11.943505, 108.426868\",\n                \"giá_vé\": \"20.000 VNĐ/người lớn\"\n              }\n            ]\n          }\n        },\n        \"trưa\": {\n          \"hoạt_động\": \"Ăn trưa tại nhà hàng L'Angora\",\n          \"nơi_ăn\": \"Nhà hàng L'Angora\",\n          \"nơi_ăn_chi_tiết\": {\n            \"placeName\": \"Nhà hàng L'Angora\",\n            \"Place Details\": \"Nhà hàng sang trọng với món ăn Âu Á tinh tế, view đẹp.\",\n            \"Place ImageUrl\": \"https://www.dalatdiscovery.com/wp-content/uploads/2022/07/nha-hang-langora-dalat.jpg\",\n            \"tọa độ địa lý\": \"11.943984, 108.425467\",\n            \"giá_vé\": \"Từ 200.000 VNĐ/người\"\n          }\n        },\n        \"chiều\": {\n          \"hoạt_động\": \"Tham quan Dinh Bảo Đại\",\n          \"nơi_tham_quan\": \"Dinh Bảo Đại\",\n          \"nơi_tham_quan_chi_tiết\": {\n            \"placeName\": \"Dinh Bảo Đại\",\n            \"Place Details\": \"Biệt thự của vua Bảo Đại, nơi lưu giữ nhiều hiện vật lịch sử.\",\n            \"Place ImageUrl\": \"https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Bao_Dai_Palace_Da_Lat_2017.jpg/1280px-Bao_Dai_Palace_Da_Lat_2017.jpg\",\n            \"tọa độ địa lý\": \"11.951844, 108.427219\",\n            \"giá_vé\": \"30.000 VNĐ/người lớn\"\n          }\n        },\n        \"tối\": {\n          \"hoạt_động\": \"Ăn tối tại nhà hàng Gà nướng\",\n          \"nơi_ăn\": \"Nhà hàng Gà nướng\",\n          \"nơi_ăn_chi_tiết\": {\n            \"placeName\": \"Nhà hàng Gà nướng\",\n            \"Place Details\": \"Nơi thưởng thức món gà nướng thơm ngon, đặc sản Đà Lạt.\",\n            \"Place ImageUrl\": \"https://media.nomadicmatt.com/2018/06/grilled-chicken-dalat.jpg\",\n            \"tọa độ địa lý\": \"11.943636, 108.427769\",\n            \"giá_vé\": \"Từ 100.000 VNĐ/người\"\n          }\n        }\n      },\n      {\n        \"ngày\": \"Ngày 2\",\n        \"sáng\": {\n          \"hoạt_động\": \"Tham quan Thiền Viện Trúc Lâm\",\n          \"nơi_tham_quan\": \"Thiền Viện Trúc Lâm\",\n          \"nơi_tham_quan_chi_tiết\": {\n            \"placeName\": \"Thiền Viện Trúc Lâm\",\n            \"Place Details\": \"Thiền viện nổi tiếng với kiến trúc độc đáo, khung cảnh thanh bình.\",\n            \"Place ImageUrl\": \"https://www.dalatdiscovery.com/wp-content/uploads/2022/07/thien-vien-truc-lam-dalat-1.jpg\",\n            \"tọa độ địa lý\": \"11.972197, 108.424538\",\n            \"giá_vé\": \"20.000 VNĐ/người lớn\"\n          }\n        },\n        \"trưa\": {\n          \"hoạt_động\": \"Ăn trưa tại quán cơm niêu\",\n          \"nơi_ăn\": \"Quán cơm niêu\",\n          \"nơi_ăn_chi_tiết\": {\n            \"placeName\": \"Quán cơm niêu\",\n            \"Place Details\": \"Quán cơm niêu ngon, bình dân, phục vụ các món ăn truyền thống.\",\n            \"Place ImageUrl\": \"https://www.dalatdiscovery.com/wp-content/uploads/2021/04/com-ni%CC%82%C3%AAu-dalat.jpg\",\n            \"tọa độ địa lý\": \"11.942216, 108.428752\",\n            \"giá_vé\": \"Từ 50.000 VNĐ/người\"\n          }\n        },\n        \"chiều\": {\n          \"hoạt_động\": \"Tham quan Lang Biang\",\n          \"nơi_tham_quan\": \"Lang Biang\",\n          \"nơi_tham_quan_chi_tiết\": {\n            \"placeName\": \"Lang Biang\",\n            \"Place Details\": \"Núi cao với phong cảnh hùng vĩ, nơi lý tưởng để trekking, ngắm cảnh.\",\n            \"Place ImageUrl\": \"https://media.nomadicmatt.com/2018/06/lang-biang-dalat.jpg\",\n            \"tọa độ địa lý\": \"11.919484, 108.404240\",\n            \"giá_vé\": \"40.000 VNĐ/người lớn\"\n          }\n        },\n        \"tối\": {\n          \"hoạt_động\": \"Di chuyển về lại\",\n          \"nơi_ở\": null\n        }\n      }\n    ]\n  }\n}\n```\n\n**Lưu ý:**\n\n* Bảng kế hoạch này chỉ là gợi ý, bạn có thể thay đổi theo sở thích và thời gian của mình.\n* Giá vé tham quan có thể thay đổi theo thời gian, vui lòng kiểm tra lại trước khi đi.\n* Mức chi tiêu có thể thay đổi theo nhu cầu của bạn.\n* Bạn nên đặt phòng khách sạn và vé tham quan trước để đảm bảo có chỗ.\n* Chúc bạn có một chuyến du lịch Đà Lạt vui vẻ!\n"},
          ],
        },
      ],
    });
  
    // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    // console.log(result.response.text());
  