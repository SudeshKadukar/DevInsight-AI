const developers = [
  { id: "dev-1", name: "Aarav Singh", team: "Platform", email: "aarav.singh@example.com", photo: "https://i.pravatar.cc/150?u=dev-1", github: "aarav-singh" },
  { id: "dev-2", name: "Mira Iyer", team: "Payments", email: "mira.iyer@example.com", photo: "https://i.pravatar.cc/150?u=dev-2", github: "miraiyer" },
  { id: "dev-3", name: "Rohan Mehta", team: "Core Infra", email: "rohan.mehta@example.com", photo: "https://i.pravatar.cc/150?u=dev-3", github: "rohanmehta-dev" },
  { id: "dev-4", name: "Neha Sharma", team: "Developer Experience", email: "neha.sharma@example.com", photo: "https://i.pravatar.cc/150?u=dev-4", github: "nsharma99" },
];

const issues = [
  { id: "ISS-101", developerId: "dev-1", inProgressAt: "2026-01-03T10:00:00Z", doneAt: "2026-01-05T16:00:00Z" },
  { id: "ISS-102", developerId: "dev-1", inProgressAt: "2026-01-08T11:30:00Z", doneAt: "2026-01-12T14:00:00Z" },
  { id: "ISS-103", developerId: "dev-1", inProgressAt: "2026-01-15T09:00:00Z", doneAt: "2026-01-20T18:15:00Z" },
  { id: "ISS-104", developerId: "dev-1", inProgressAt: "2026-02-04T10:30:00Z", doneAt: "2026-02-07T17:00:00Z" },
  { id: "ISS-105", developerId: "dev-1", inProgressAt: "2026-02-10T09:15:00Z", doneAt: "2026-02-16T15:30:00Z" },
  { id: "ISS-106", developerId: "dev-1", inProgressAt: "2026-02-18T12:00:00Z", doneAt: "2026-02-25T19:00:00Z" },
  { id: "ISS-107", developerId: "dev-2", inProgressAt: "2026-01-06T08:45:00Z", doneAt: "2026-01-10T16:45:00Z" },
  { id: "ISS-108", developerId: "dev-2", inProgressAt: "2026-01-14T10:00:00Z", doneAt: "2026-01-18T13:00:00Z" },
  { id: "ISS-109", developerId: "dev-2", inProgressAt: "2026-02-02T09:45:00Z", doneAt: "2026-02-06T18:00:00Z" },
  { id: "ISS-110", developerId: "dev-2", inProgressAt: "2026-02-11T11:00:00Z", doneAt: "2026-02-15T16:30:00Z" },
  { id: "ISS-111", developerId: "dev-3", inProgressAt: "2026-01-04T09:30:00Z", doneAt: "2026-01-07T15:00:00Z" },
  { id: "ISS-112", developerId: "dev-3", inProgressAt: "2026-01-12T10:00:00Z", doneAt: "2026-01-16T17:00:00Z" },
  { id: "ISS-113", developerId: "dev-3", inProgressAt: "2026-02-03T08:45:00Z", doneAt: "2026-02-08T14:00:00Z" },
  { id: "ISS-114", developerId: "dev-3", inProgressAt: "2026-02-14T11:15:00Z", doneAt: "2026-02-20T18:30:00Z" },
  { id: "ISS-115", developerId: "dev-4", inProgressAt: "2026-01-05T10:15:00Z", doneAt: "2026-01-09T16:45:00Z" },
  { id: "ISS-116", developerId: "dev-4", inProgressAt: "2026-01-17T09:00:00Z", doneAt: "2026-01-22T13:00:00Z" },
  { id: "ISS-117", developerId: "dev-4", inProgressAt: "2026-02-06T10:30:00Z", doneAt: "2026-02-12T17:15:00Z" },
  { id: "ISS-118", developerId: "dev-4", inProgressAt: "2026-02-18T08:30:00Z", doneAt: "2026-02-24T16:00:00Z" },
];

const pullRequests = [
  { id: "PR-201", developerId: "dev-1", openedAt: "2026-01-02T09:00:00Z", mergedAt: "2026-01-05T12:00:00Z" },
  { id: "PR-202", developerId: "dev-1", openedAt: "2026-01-09T10:00:00Z", mergedAt: "2026-01-12T13:00:00Z" },
  { id: "PR-203", developerId: "dev-1", openedAt: "2026-01-16T08:30:00Z", mergedAt: "2026-01-20T14:15:00Z" },
  { id: "PR-204", developerId: "dev-1", openedAt: "2026-02-03T11:00:00Z", mergedAt: "2026-02-07T12:00:00Z" },
  { id: "PR-205", developerId: "dev-1", openedAt: "2026-02-09T09:30:00Z", mergedAt: "2026-02-16T17:30:00Z" },
  { id: "PR-206", developerId: "dev-1", openedAt: "2026-02-18T10:15:00Z", mergedAt: "2026-02-25T18:30:00Z" },
  { id: "PR-207", developerId: "dev-2", openedAt: "2026-01-05T08:15:00Z", mergedAt: "2026-01-10T14:00:00Z" },
  { id: "PR-208", developerId: "dev-2", openedAt: "2026-01-13T09:45:00Z", mergedAt: "2026-01-18T12:30:00Z" },
  { id: "PR-209", developerId: "dev-2", openedAt: "2026-02-01T10:00:00Z", mergedAt: "2026-02-06T15:00:00Z" },
  { id: "PR-210", developerId: "dev-2", openedAt: "2026-02-10T10:30:00Z", mergedAt: "2026-02-15T16:00:00Z" },
  { id: "PR-211", developerId: "dev-3", openedAt: "2026-01-03T09:00:00Z", mergedAt: "2026-01-07T13:30:00Z" },
  { id: "PR-212", developerId: "dev-3", openedAt: "2026-01-11T10:00:00Z", mergedAt: "2026-01-16T15:45:00Z" },
  { id: "PR-213", developerId: "dev-3", openedAt: "2026-02-02T09:15:00Z", mergedAt: "2026-02-08T12:00:00Z" },
  { id: "PR-214", developerId: "dev-3", openedAt: "2026-02-13T10:30:00Z", mergedAt: "2026-02-20T17:30:00Z" },
  { id: "PR-215", developerId: "dev-4", openedAt: "2026-01-04T08:45:00Z", mergedAt: "2026-01-09T14:30:00Z" },
  { id: "PR-216", developerId: "dev-4", openedAt: "2026-01-16T11:00:00Z", mergedAt: "2026-01-22T12:30:00Z" },
  { id: "PR-217", developerId: "dev-4", openedAt: "2026-02-05T09:30:00Z", mergedAt: "2026-02-12T15:30:00Z" },
  { id: "PR-218", developerId: "dev-4", openedAt: "2026-02-17T10:15:00Z", mergedAt: "2026-02-24T16:45:00Z" },
];

const deployments = [
  { id: "DEP-301", prId: "PR-201", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-01-06T10:00:00Z" },
  { id: "DEP-302", prId: "PR-202", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-01-13T09:00:00Z" },
  { id: "DEP-303", prId: "PR-203", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-01-21T08:00:00Z" },
  { id: "DEP-304", prId: "PR-204", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-02-08T10:00:00Z" },
  { id: "DEP-305", prId: "PR-205", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-02-18T08:00:00Z" },
  { id: "DEP-306", prId: "PR-206", developerId: "dev-1", environment: "prod", status: "success", deployedAt: "2026-02-27T10:00:00Z" },
  { id: "DEP-307", prId: "PR-207", developerId: "dev-2", environment: "prod", status: "success", deployedAt: "2026-01-11T09:30:00Z" },
  { id: "DEP-308", prId: "PR-208", developerId: "dev-2", environment: "prod", status: "success", deployedAt: "2026-01-19T08:45:00Z" },
  { id: "DEP-309", prId: "PR-209", developerId: "dev-2", environment: "prod", status: "success", deployedAt: "2026-02-07T10:30:00Z" },
  { id: "DEP-310", prId: "PR-210", developerId: "dev-2", environment: "prod", status: "success", deployedAt: "2026-02-16T08:15:00Z" },
  { id: "DEP-311", prId: "PR-211", developerId: "dev-3", environment: "prod", status: "success", deployedAt: "2026-01-08T10:15:00Z" },
  { id: "DEP-312", prId: "PR-212", developerId: "dev-3", environment: "prod", status: "success", deployedAt: "2026-01-17T09:00:00Z" },
  { id: "DEP-313", prId: "PR-213", developerId: "dev-3", environment: "prod", status: "success", deployedAt: "2026-02-09T08:45:00Z" },
  { id: "DEP-314", prId: "PR-214", developerId: "dev-3", environment: "prod", status: "success", deployedAt: "2026-02-21T10:00:00Z" },
  { id: "DEP-315", prId: "PR-215", developerId: "dev-4", environment: "prod", status: "success", deployedAt: "2026-01-10T09:30:00Z" },
  { id: "DEP-316", prId: "PR-216", developerId: "dev-4", environment: "prod", status: "success", deployedAt: "2026-01-23T08:30:00Z" },
  { id: "DEP-317", prId: "PR-217", developerId: "dev-4", environment: "prod", status: "success", deployedAt: "2026-02-13T09:15:00Z" },
  { id: "DEP-318", prId: "PR-218", developerId: "dev-4", environment: "prod", status: "success", deployedAt: "2026-02-25T10:30:00Z" },
];

const bugs = [
  { id: "BUG-401", developerId: "dev-1", issueId: "ISS-103", foundAt: "2026-01-28T10:00:00Z", environment: "prod" },
  { id: "BUG-402", developerId: "dev-1", issueId: "ISS-105", foundAt: "2026-02-21T11:00:00Z", environment: "prod" },
  { id: "BUG-403", developerId: "dev-1", issueId: "ISS-106", foundAt: "2026-02-26T09:00:00Z", environment: "prod" },
  { id: "BUG-404", developerId: "dev-2", issueId: "ISS-108", foundAt: "2026-01-25T14:00:00Z", environment: "prod" },
  { id: "BUG-405", developerId: "dev-3", issueId: "ISS-112", foundAt: "2026-01-29T10:30:00Z", environment: "prod" },
  { id: "BUG-406", developerId: "dev-4", issueId: "ISS-117", foundAt: "2026-02-20T13:00:00Z", environment: "prod" },
];

module.exports = {
  developers,
  issues,
  pullRequests,
  deployments,
  bugs,
};
