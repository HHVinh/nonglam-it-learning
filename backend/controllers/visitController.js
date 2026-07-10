const VisitCount = require('../models/VisitCount');

// 1. Lấy số lượt truy cập hiện tại
const getVisitCount = async (req, res) => {
  try {
    let visit = await VisitCount.findOne(); // Lấy bản ghi đầu tiên và duy nhất
    if (!visit) {
      // Nếu chưa có, tạo mới với giá trị 0
      visit = new VisitCount({ count: 0 });
      await visit.save();
    }
    res.status(200).json({ count: visit.count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tải lượt truy cập", error: error.message });
  }
};

// 2. Tăng số lượt truy cập lên 1
const incrementVisitCount = async (req, res) => {
  try {
    let visit = await VisitCount.findOne();
    if (!visit) {
      visit = new VisitCount({ count: 1 });
    } else {
      visit.count += 1; // Cộng dồn
    }
    await visit.save();
    res.status(200).json({ count: visit.count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server khi tăng lượt truy cập", error: error.message });
  }
};

module.exports = { getVisitCount, incrementVisitCount };
