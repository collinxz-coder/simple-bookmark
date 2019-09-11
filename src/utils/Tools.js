export default class Tools {

  static listToTree(list) {
    let map = { };
    list.forEach(item => {
      if (!map[item.id]) {
        map[item.id] = item;
      }
    });

    list.forEach(item => {
      if (item.parent_id != 0) {
        map[item.parent_id].children ? map[item.parent_id].children.push(item) : map[item.parent_id].children = [item];
      }
    });

    return list.filter(item => {
      if (item.parent_id == 0) {
        return item;
      }
    });
  }
}
