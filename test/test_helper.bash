emulate_github_env() {
  export GITHUB_OUTPUT=$(mktemp)
  export GITHUB_STEP_SUMMARY=$(mktemp)
}

init() {
  load 'test_helper/bats-support/load' # this is required by bats-assert!
  load 'test_helper/bats-assert/load'
}