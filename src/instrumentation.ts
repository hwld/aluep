export function register() {
  if (process.env.NODE_ENV === "production") {
    require("@google-cloud/profiler").start({
      serviceContext: { service: "aluep" },
    });
  }
}
