#!/Library/Frameworks/Python.framework/Versions/3.11/bin/python3

from random import choice

def get_required_foobar() -> int | None:
    return 1 if choice([True, False]) else None



def caller():
    if not (foobar := get_required_foobar()):  # Handle case where things
        return -1                              # don't turn out as expected
                                               # Also
    return foobar                              # This is a convenient way
                                               # to gather requirements
                                               # while also practicing
                                               # inversion, a coding style
                                               # that leads to simpler and
                                               # less error prone code, where
                                               # checks are done first,
                                               # extracting these logic
                                               # from what we're trying to do. 
