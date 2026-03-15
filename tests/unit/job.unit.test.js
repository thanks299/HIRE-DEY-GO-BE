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

    const limitMock = mock.fn(async () => fakeJobs);
    const skipMock = mock.fn(() => ({ limit: limitMock }));
    const sortMock = mock.fn(() => ({ skip: skipMock }));
    const populateMock = mock.fn(() => ({ sort: sortMock }));
    const findMock = mock.method(Job, "find", () => ({ populate: populateMock }));

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

    assert.strictEqual(findMock.mock.callCount(), 1);
    assert.strictEqual(countMock.mock.callCount(), 1);

    findMock.mock.restore();
    countMock.mock.restore();
  });

  test("getJobs should pass errors to next", async () => {
    const boom = new Error("db-failure");
    const findMock = mock.method(Job, "find", () => {
      throw boom;
    });

    const req = { query: {} };
    const res = makeRes();
    const next = mock.fn();

    await getJobs(req, res, next);

    assert.strictEqual(next.mock.callCount(), 1);
    assert.strictEqual(next.mock.calls[0].arguments[0], boom);

    findMock.mock.restore();
  });
});