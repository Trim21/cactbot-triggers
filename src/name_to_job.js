/**
 * 复制到raidboss.js文件里，如果没有的话就重命名为raidboss.js,然后复制到CACTBOT_USER文件夹下。
 *
 * */
(() => {
  const nameToJobEnum = {
    1: '剑术师',
    2: '格斗家',
    3: '斧术师',
    4: '枪术师',
    5: '弓箭手',
    6: '幻术师',
    7: '咒术师',
    8: '刻木匠',
    9: '锻铁匠',
    10: '铸甲匠',
    11: '雕金匠',
    12: '制革匠',
    13: '裁衣匠',
    14: '炼金术士',
    15: '烹调师',
    16: '采矿工',
    17: '园艺工',
    26: '秘术师',
    18: '捕鱼人',
    29: '双剑师',
    99: '魔法导师',
    20: '武僧',
    21: '战士',
    23: '诗人',
    19: '骑士',
    24: '白魔',
    25: '黑魔',
    27: '召唤',
    22: '龙骑',
    28: '学者',
    30: '忍者',
    31: '机工',
    32: '黑骑',
    33: '占星',
    34: '武士',
    35: '赤魔',
    36: '青魔',
    37: '枪刃',
    38: '舞者',
    39: '钐镰客',
    40: '贤者',
  };
  const playerNicks = (Options.PlayerNicks = {});
  addOverlayListener('PartyChanged', (e) => {
    for (const [key] of Object.entries(playerNicks)) {
      delete playerNicks[key];
    }
    for (const party of e.party) {
      const v = nameToJobEnum[party.job];
      if (v) {
        playerNicks[party.name] = v;
      }
    }
    console.log(JSON.stringify(playerNicks));
  });
})();
