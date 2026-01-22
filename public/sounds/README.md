# Sound Effects

Thư mục này chứa các file âm thanh cho game.

## File cần thiết

- `wrong.mp3` - Âm thanh phát khi trả lời sai câu hỏi
- `correct.mp3` - Âm thanh phát khi trả lời đúng câu hỏi
- `winner.mp3` - Âm thanh phát khi có người thắng cuộc
- `dice.mp3` - Âm thanh phát khi gieo xúc xắc

## Âm thanh xúc xắc được đề xuất

**Video YouTube:** https://www.youtube.com/watch?v=dEHqgEjNsms

Để tải âm thanh từ YouTube:

1. Truy cập: https://ytmp3.nu/ hoặc https://y2mate.com/
2. Dán link: `https://www.youtube.com/watch?v=dEHqgEjNsms`
3. Chọn tải MP3
4. Đổi tên file thành `dice.mp3`
5. Đặt vào thư mục `public/sounds/`

## Cách thêm file âm thanh

1. Tải file âm thanh (định dạng `.mp3` hoặc `.wav`)
2. Đặt tên file là `wrong.mp3`, `correct.mp3`, `winner.mp3`, hoặc `dice.mp3`
3. Bỏ vào thư mục `public/sounds/`

**Lưu ý:** Nếu bạn chưa có file âm thanh, game sẽ tự động sử dụng fallback URL công khai.

## Nguồn âm thanh miễn phí

Bạn có thể tải sound effect từ:

- **Mixkit** (khuyến nghị): https://mixkit.co/free-sound-effects/error/
- **Freesound**: https://freesound.org/ (cần đăng ký)
- **Zapsplat**: https://www.zapsplat.com/ (cần đăng ký)

**Từ khóa tìm kiếm:**

- Âm thanh sai: "wrong answer", "error sound", "buzzer", "incorrect", "fail"
- Âm thanh thắng: "victory", "win", "celebration", "fanfare", "success", "achievement"
- Âm thanh xúc xắc: "dice roll", "dice throw", "rolling dice", "dice sound", "board game"

## Cách test

1. Chạy game: `npm run dev`
2. Vào trang game và trả lời sai một câu hỏi
3. Âm thanh sẽ tự động phát khi bạn trả lời sai
