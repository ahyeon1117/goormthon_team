class DateUtils {
  formatDate(date, format) {
    if (format === "month") {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else if (format === "day") {
      return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    } else {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    }
  }
}
export default DateUtils;
