import { describe, test, mock } from "node:test";
import assert from "node:assert/strict";
import Job from "../../src/models/job.model.js";
import { getJobs } from "../../src/modules/job/jobs.controller.js";

const makeRes = () => {
  const res = {};
  res.status = mock.fn((code) => {
    res.statusCode = code;
    return res;
  });
  res.json = mock.fn((payload) => {
    res.payload = payload;
    return res;
  });
  return res;
};

describe("Job Controller Unit", () => {
  test("getJobs should apply pagination/sorting and return shaped response", async () => {
    const fakeJobs = [{ title: "Backend Engineer" }];

    const findMock = mock.method(Job, "find", () => ({
      populate: mock.fn(() => ({
        sort: mock.fn(() => ({
          skip: mock.fn(() => ({
            limit: mock.fn(async () => fakeJobs),
          })),
        })),
      })),
    }));

    const countMock = mock.method(Job, "countDocuments", async () => 11);

    const req = { query: { page: "2", sort: "deadline", status: "active", type: "full_time" } };
    const res = makeRes();
    const next = mock.fn();

    await getJobs(req, res, next);

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.payload.success, true);
    assert.strictEqual(res.payload.meta.current_page, 2);
    assert.strictEqual(res.payload.meta.total_pages, 2);
    assert.strictEqual(res.payload.meta.length, 1);
    assert.deepStrictEqual(res.payload.data, fakeJobs);

    findMock.mock.restore();
    countMock.mock.restore();
  });
});
