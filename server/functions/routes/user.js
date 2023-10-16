const router = require("express").Router();
const admin = require("firebase-admin");
let data = [];

router.get("/", (req, res) => {
  return res.send("Inside the user router");
});

router.get("/jwtVerfication", async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({
      msg: "Token Not Found"
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decodedValue = await admin.auth().verifyIdToken(token);
    if (!decodedValue) {
      return res
        .status(500)
        .json({
          success: false,
          msg: "Unauthorized access"
        });
    }
    return res.status(200).json({
      success: true,
      data: decodedValue
    });
  } catch (err) {
    return res.send({
      success: false,
      msg: `Error in extracting the token : ${err}`,
    });
  }
});

// Tuyến đường này kiểm tra xem token có được gửi trong tiêu đề yêu cầu (headers) hay không. Nếu không tìm thấy token, 
// tuyến đường sẽ trả về một phản hồi không thành công với mã trạng thái 500 và thông báo "Token Not Found".

// Nếu token được tìm thấy trong tiêu đề yêu cầu, tuyến đường sẽ lấy token từ tiêu đề và cắt bỏ phần "Bearer " để chỉ lấy phần mã JWT.

// Tiếp theo, tuyến đường sử dụng admin.auth().verifyIdToken(token) để xác minh và giải mã token. Nếu token hợp lệ, hàm verifyIdToken sẽ trả về giá trị giải mã của token.

// Nếu token không hợp lệ hoặc xảy ra lỗi trong quá trình giải mã, tuyến đường sẽ trả về một phản hồi không thành công với mã trạng thái 500 và thông báo lỗi.

// Nếu giải mã thành công, tuyến đường sẽ trả về một phản hồi thành công với mã trạng thái 200 và dữ liệu đã được giải mã (decodedValue) từ token.

const listALlUsers = async (nextpagetoken) => {
  admin
    .auth()
    .listUsers(1000, nextpagetoken)
    .then((listuserresult) => {
      listuserresult.users.forEach((rec) => {
        data.push(rec.toJSON());
      });
      if (listuserresult.pageToken) {
        listALlUsers(listuserresult.pageToken);
      }
    })
    .catch((er) => console.log(er));
};

listALlUsers();

router.get("/all", async (req, res) => {
  listALlUsers();
  try {
    return res
      .status(200)
      .send({
        success: true,
        data: data,
        dataCount: data.length
      });
  } catch (er) {
    return res.send({
      success: false,
      msg: `Error in listing users :,${er}`,
    });
  }
});
// listALlUsers: Hàm này được sử dụng để lấy danh sách tất cả người dùng từ Firebase Authentication. 
// Nó sử dụng admin.auth().listUsers để lấy 1000 người dùng mỗi lần gọi và sử dụng token trang kế tiếp để lấy các trang tiếp theo của người dùng (nếu có). 
// Kết quả của từng trang đều được đưa vào mảng data.

// router.get("/all", ...): Đây là tuyến đường được định nghĩa để lấy tất cả người dùng từ Firebase Authentication và trả về danh sách người dùng thông qua API. 
// Trong tuyến đường này, bạn gọi hàm listALlUsers để lấy danh sách người dùng và sau đó trả về kết quả dưới dạng một đối tượng JSON bao gồm mảng data chứa danh sách người dùng 
// và dataCount là số lượng người dùng trong danh sách.

module.exports = router;