function isTemporalStasis (data) {
  // return (data.userPhase === 'Temporal Stasis') &&
  return data.phase === 'brute'
}

Options.Triggers.push({
  zoneId: ZoneId.TheEpicOfAlexanderUltimate,
  triggers: [
    {
      id: 'TEA 时停 无Buff',
      // This id is "restraining order".
      netRegex: NetRegexes.gainsEffect({ effectId: '464', capture: false }),
      condition: function (data) {
        return isTemporalStasis(data)
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      alertText: function (data, _, output) {
        if (data.me in data.buffMap) return
        if (data.role === 'dps') return output.DPS()
        return output.TH()
      },
      outputStrings: {
        TH: '左侧 boss 上方',
        DPS: '左侧 boss 下方',
      },
    },
    {
      id: 'TEA 时停 远线',
      netRegex: NetRegexes.gainsEffect({ effectId: '464' }),
      condition: function (data, matches) {
        return matches.target === data.me && isTemporalStasis(data)
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      alertText: function (data, _, output) {
        if (data.role === 'dps') return output.DPS()
        return output.TH()
      },
      outputStrings: {
        TH: '去场地左侧边缘 有飞机靠近',
        DPS: '去场地右侧边缘 有飞机靠近',
      },
    },
    {
      id: 'TEA 时停 近线',
      netRegex: NetRegexes.gainsEffect({ effectId: '463' }),
      condition (data, matches) {
        return (matches.target === data.me) && isTemporalStasis(data)
      },
      delaySeconds: 1,
      durationSeconds: 10,
      alertText: (data, _, output) => {
        if (data.role === 'dps') return output.DPS()
        return output.TH()
      },
      outputStrings: {
        TH: '右侧 boss 上方',
        DPS: '右侧 boss 下方',
      },
    },
    {
      id: 'TEA 时停 电',
      netRegex: NetRegexes.gainsEffect({ effectId: '461' }),
      condition (data, matches) {
        return matches.target === data.me && isTemporalStasis(data)
      },
      delaySeconds: 0.5,
      durationSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: '正义方向场地边缘',
      },
    },
  ],
})
