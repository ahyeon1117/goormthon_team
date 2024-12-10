class DateUtils {
  formatDate(date, dailyMonthly) {
    if (dailyMonthly === "month") {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } else {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}.${date.getDate()}`;
    }
  }
}
export default DateUtils;
