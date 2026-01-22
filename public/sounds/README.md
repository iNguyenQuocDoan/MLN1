# Sound Effects

Thư mục này chứa các file âm thanh cho game.

## File cần thiết

- `wrong.mp3` - Âm thanh phát khi trả lời sai câu hỏi

## Cách thêm file âm thanh

1. Tải file âm thanh (định dạng `.mp3` hoặc `.wav`)
2. Đặt tên file là `wrong.mp3`
3. Bỏ vào thư mục `public/sounds/`

**Lưu ý:** Nếu bạn chưa có file `wrong.mp3`, game sẽ tự động sử dụng fallback URL công khai.

## Nguồn âm thanh miễn phí

Bạn có thể tải sound effect từ:
- **Mixkit** (khuyến nghị): https://mixkit.co/free-sound-effects/error/
- **Freesound**: https://freesound.org/ (cần đăng ký)
- **Zapsplat**: https://www.zapsplat.com/ (cần đăng ký)

**Từ khóa tìm kiếm:** "wrong answer", "error sound", "buzzer", "incorrect", "fail"

## Cách test

1. Chạy game: `npm run dev`
2. Vào trang game và trả lời sai một câu hỏi
3. Âm thanh sẽ tự động phát khi bạn trả lời sai

