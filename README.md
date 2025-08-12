Hướng dẫn sử dụng repository "Tutorial-Assignment"
Repository này chứa các bài tập thực hành về smart contract, tập trung vào các bài học từ Lesson 6 đến Lesson 8. Dưới đây là hướng dẫn chi tiết để làm việc với repository, đặc biệt là thư mục hello_world, và cách hoàn thành bài tập về nhà.
1. Yêu cầu môi trường
Để chạy các script trong repository, bạn cần cài đặt:

Node.js: Tải và cài đặt từ nodejs.org.
TypeScript và tsx: Cài đặt toàn cục bằng lệnh:npm install -g typescript tsx



Nếu thư mục gốc hoặc thư mục con có file package.json, chạy:
npm install

để cài đặt các dependencies cần thiết.
2. Clone repository
Clone repository về máy tính của bạn:
git clone https://github.com/longdevbf/Tutorial-Assignment.git

Lệnh này tạo thư mục Tutorial-Assignment trong thư mục hiện tại.
3. Di chuyển đến thư mục hello_world
Repository có nhiều thư mục con, mỗi thư mục tương ứng với một bài học hoặc bài tập. Để làm việc với bài tập trong thư mục hello_world, di chuyển đến thư mục đó:
cd Tutorial-Assignment/hello_world

4. Chạy các script
Trong thư mục hello_world, bạn sẽ thấy các file như lock.ts và unlock.ts. Đây là các script TypeScript để thực hiện các giao dịch khóa (lock) và mở khóa (unlock) tài sản trên blockchain (có thể là Cardano).
Chạy script lock.ts
Script này khóa tài sản vào một smart contract. Chạy lệnh:
npx tsx lock.ts

Output sẽ hiển thị transaction hash (txhash) của giao dịch khóa, ví dụ:
tx hash: a922a19b5434c32d7f787ad63066d5998aac19f1d40f1df5a417cc4b83b09293

Chạy script unlock.ts
Script này mở khóa tài sản từ smart contract. Chạy lệnh:
npx tsx unlock.ts

Output sẽ hiển thị txhash của giao dịch mở khóa, ví dụ:
tx hash: c1ca473c800950e738e373638fd745e03ab12531da388e4f3eb373cbdc16e8cd

Lưu ý:

Đảm bảo bạn đã thiết lập đúng môi trường blockchain (ví dụ: Cardano Preview Network) nếu script yêu cầu kết nối blockchain.
Nếu gặp lỗi, kiểm tra xem bạn đã cài đặt đầy đủ dependencies và cấu hình API key (nếu cần).

5. Bài tập về nhà
Bài tập yêu cầu bạn gửi link code github kèm file readme.md ghi lại các transaction hash (txhash) từ các giao dịch khóa và mở khóa trong thư mục hello_world.

Txhash của giao dịch lock:

Chạy npx tsx lock.ts.
Tìm dòng tx hash: <hash> trong output console.
Ghi lại giá trị <hash> (ví dụ: a922a19b5434c32d7f787ad63066d5998aac19f1d40f1df5a417cc4b83b09293).


Txhash của giao dịch unlock:

Chạy npx tsx unlock.ts.
Tìm dòng tx hash: <hash> trong output console.
Ghi lại giá trị <hash> (ví dụ: c1ca473c800950e738e373638fd745e03ab12531da388e4f3eb373cbdc16e8cd).



Lưu ý:

Các txhash sẽ khác nhau mỗi lần chạy script, vì chúng phụ thuộc vào trạng thái blockchain tại thời điểm thực hiện.
Nếu repository có thêm yêu cầu cụ thể (ví dụ: kiểm tra giao dịch trên blockchain explorer), hãy đọc kỹ các file README hoặc comment trong code.

6. Lưu ý bổ sung

Kiểm tra tài liệu: Nếu có file README.md trong thư mục hello_world hoặc các thư mục khác, hãy đọc để biết thêm chi tiết về bài tập.
Blockchain configuration: Một số script có thể yêu cầu API key (như Blockfrost) hoặc kết nối đến mạng Cardano Preview. Đảm bảo bạn đã cấu hình đúng theo hướng dẫn trong repository.
Lỗi thường gặp: Nếu script không chạy, kiểm tra:
Đã cài đặt Node.js, TypeScript, và tsx.
Đã chạy npm install nếu cần.
Kết nối mạng và API key hợp lệ.



7. Tài nguyên tham khảo

Node.js - Tải và cài đặt Node.js.
TypeScript - Tài liệu chính thức về TypeScript.
Cardano Developer Portal - Tài liệu về lập trình smart contract trên Cardano.
Blockfrost API - Dịch vụ API cho Cardano, có thể được sử dụng trong repository.

Nếu bạn gặp khó khăn hoặc cần thêm hướng dẫn, hãy kiểm tra các file trong repository hoặc liên hệ với mình qua tele longdevbf nhé ^^.
