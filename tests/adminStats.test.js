import test from "node:test";
import assert from "node:assert/strict";
import { agoLabel, listingState, meterPercent, meterState, waitedLabel } from "../lib/adminStats.js";

const now = "2026-10-29T12:00:00Z";

test("how long something has waited is said in plain words", () => {
  assert.equal(waitedLabel("2026-10-29T01:00:00Z", now), "today");
  assert.equal(waitedLabel("2026-10-28T11:00:00Z", now), "1 day");
  assert.equal(waitedLabel("2026-10-24T12:00:00Z", now), "5 days");
  assert.equal(waitedLabel("2026-10-01T12:00:00Z", now), "4 weeks");
  assert.equal(waitedLabel("2026-11-05T12:00:00Z", now), "today"); // a date in the future never gives a negative number
  assert.equal(agoLabel("2026-10-29T01:00:00Z", now), "today");
  assert.equal(agoLabel("2026-10-26T12:00:00Z", now), "3 days ago");
});

test("a daily limit's meter stays between 0 and 100 and changes color at 70% and 100%", () => {
  assert.equal(meterPercent(0, 300), 0);
  assert.equal(meterPercent(150, 300), 50);
  assert.equal(meterPercent(400, 300), 100);
  assert.equal(meterPercent(5, 0), 100);
  assert.equal(meterPercent(5, NaN), 100);
  assert.equal(meterPercent(-3, 100), 0);
  assert.equal(meterState(69), "ok");
  assert.equal(meterState(70), "warn");
  assert.equal(meterState(99), "warn");
  assert.equal(meterState(100), "full");
});

test("a listing's state: withdrawn beats everything, then waiting, rejected, filled, live", () => {
  assert.deepEqual(listingState({ approvalStatus: "approved", status: "archived" }), { label: "Withdrawn", tone: "withdrawn" });
  assert.equal(listingState({ approvalStatus: "pending", status: "active" }).label, "Waiting");
  assert.equal(listingState({ approvalStatus: "rejected", status: "active" }).label, "Rejected");
  assert.equal(listingState({ approvalStatus: "approved", status: "filled" }).label, "Filled");
  assert.equal(listingState({ approvalStatus: "approved", status: "active" }).label, "Live");
});
