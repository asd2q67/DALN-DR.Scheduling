'*** Instance-generator '
"Doctor.csv " : Lưu các trường thông tin của bác sĩ
"Room.csv" : Lưu các trường thông tin của phòng bệnh
"Day-off.csv" : Ngày nghỉ lễ của các bác sĩ, theo thứ tự id của bác
(Nếu -1 : nghĩa là bác sĩ ko nghỉ )sĩ

*** Schedule
"Solver.py" : Code thuật toán greedy

* Mục tiêu :
    - Tạo ra một ma trận với kích thước |num_rooms|x|num_days|
    - Giá trị mỗi ô sẽ là id của một bác sĩ

* Idea
B1 : Tạo ma trận rỗng , sau đó, từ trường thông tin ngày đăng kí làm việc của từng bác sĩ, điền vào ma trận giá trị tương ứng

B2 :
For với từng ngày :
    Tạo ra list các bác sĩ đã được phân công(để check )
    For với từng phòng :
        check xem có bác sĩ nào đăng kí chưa :
        Nếu giá trị = 0 (tức chưa bác sĩ nào đăng kí làm hôm nay):
            !! Dựa vào nhu cầu level từng phòng, tìm được list các bác sĩ
            (check xem trong list bác sĩ, có ai thuộc ds nghỉ hay đã được phân công phòng khác )
            Từ list các bác sĩ, chọn ra người có workload thấp nhất
            Cập nhật ma trận, cập nhật workload của bác sĩ
        Nếu đã có người đăng kí :
            Check xem đạt yêu cầu số lượng level cho từng phòng
            Nếu chưa đạt : làm lại từ !!
