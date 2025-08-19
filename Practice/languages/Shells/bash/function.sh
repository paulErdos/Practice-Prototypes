#!/usr/bin/env bash

# Basic
my_function() {
  echo "Hello from my_function!"
}

# Equivalent
function my_function {
  echo "Hello from my_function!"
}

# Call
my_function

# Parameters
greet() {
  echo "Hello, $1!"
}

greet "Alice"  # Outputs: Hello, Alice!


######
# Returning
######

# Numeric: Use 'return'
check_even() {
  if (( $1 % 2 == 0 )); then
    return 0  # success
  else
    return 1  # failure
  fi
}

check_even 4
if [[ $? -eq 0 ]]; then
  echo "Even"
else
  echo "Odd"
fi


# String: Use 'echo'
get_date() {
  echo "$(date)"
}

now=$(get_date)
echo "Current time is: $now"

