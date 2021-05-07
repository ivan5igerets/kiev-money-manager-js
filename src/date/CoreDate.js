export class CoreDate {
  static now() {
    const o_date_now = new Date();
    const i_month = o_date_now.getMonth()+1;
    const i_day = o_date_now.getDate();
    return o_date_now.getFullYear()+'-'+(i_month < 10 ? '0'+i_month : i_month)+'-'+(i_day < 10 ? '0'+i_day : i_day);
  }

  static toArray(dl_date) {
    return dl_date.split('-');
  }

  static systemNow() {
    let dl_date = localStorage.getItem('dl_date')
    if(!dl_date)
      dl_date = CoreDate.now()

    return dl_date;
  }

  static systemSet(dl_date) {
    localStorage.setItem('dl_date', dl_date)
  }
}