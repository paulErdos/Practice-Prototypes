#!/usr/bin/env python3

# Given a grid

from random import random
maxsize = 100
n_rows = int(random()*maxsize)
m_cols = int(random()*maxsize)
grid = [[None for _ in range(m_cols)] for _ in range(n_rows)]

# If we're at a cell...
point = (int(n_rows*random()),
         int(m_cols*random()))

print()
print(f'Grid: {n_rows} rows x {m_cols} columns; point: {point}')
print('='*80)
print()
print()

# ... and we want to check just the vertical and horizontals around it, we can
# A: Brute force, or
# B: Select proper offsets using zip: not work, we need product
# C: Just type them out [(0, 1), (1, 0), (-1, 0), (0, -1)]
# ================================================================================



# A
# ================================================================================

print('A: Brute Force', '='*65)
print('='*80, '\n')
# First iterate over all around
for rowoffset in [1, 0, -1]:
    for coloffset in [1, 0, -1]:

        # Then we have to make sure we're on the grid
        if (0 <= point[0] + rowoffset < n_rows) == False:
            continue
        if (0 <= point[1] + coloffset < m_cols) == False:
            continue

        # Then we have to discard diagonally adjacent iters
        abscoords = abs(rowoffset), abs(coloffset)
        if 0 not in abscoords or 1 not in abscoords:
            continue

        # Then we can do something
        newpoint = point[0] + rowoffset, point[1] + coloffset
        print(newpoint)
# Right? Right.
print()
print()
# ================================================================================


# B
# ================================================================================

print(p := 'A: A Priori Index Whitelist Formation', '='*(80 - len(p) - 1))
print('='*80, '\n')


# However, can we do this more simply?

a = [-1, 0, 1]
osets = [(u, v) for u in a for v in a if abs(u) ^ abs(v)]

for rowoffset, coloffset in osets:
    newpoint = point[0] + rowoffset, point[1] + coloffset

    # We have to make sure we're on the grid
    if not 0 <= newpoint[0] < n_rows:
        continue
    if not 0 <= newpoint[1] < m_cols:
        continue

    # Then we can do something
    print(newpoint)

print()
print()
# ================================================================================


# C: Just write them out
# ================================================================================

print(p := 'C: There are only four, just know them.', '='*(80 - len(p) - 1))
print('='*80, '\n')


for rowoffset, coloffset in [(-1, 0), (0, -1), (1, 0), (0, 1)]:
    newpoint = point[0] + rowoffset, point[1] + coloffset

    # We have to make sure we're on the grid
    if not 0 <= newpoint[0] < n_rows:
        continue
    if not 0 <= newpoint[1] < m_cols:
        continue

    # Then we can do something
    print(newpoint)

print()
print()

# ================================================================================






