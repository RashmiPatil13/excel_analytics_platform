const ss = require("simple-statistics");

function numStats(arr) {
  return {
    count: arr.length,
    mean: ss.mean(arr),
    median: ss.median(arr),
    min: ss.min(arr),
    max: ss.max(arr),
    stdev: ss.standardDeviation(arr),
  };
}

function catStats(arr, topN = 5) {
  const freq = {};
  arr.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([value, count]) => ({ value, count }));
}

module.exports = function generateInsights(rows) {
  const res = {};
  if (!rows.length) return res;

  const cols = Object.keys(rows[0]);
  cols.forEach((col) => {
    const vals = rows.map((r) => r[col]).filter((v) => v != null);
    const nums = vals.map(Number);
    const allNums = nums.every((n) => !Number.isNaN(n));

    res[col] = allNums ? numStats(nums) : catStats(vals);
  });
  return res;
};
