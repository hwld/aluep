export function register() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_RUNTIME === "nodejs"
  ) {
    require("@google-cloud/profiler").start({
      serviceContext: { service: "aluep" },
      timeIntervalMicros: 0,
    });
  }
}
