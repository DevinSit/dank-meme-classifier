from unittest import TestCase


class TestDummy(TestCase):
    """Dummy test just so that PyTest has something to find and not fail on zero tests."""
    def test_dummy(self):
        self.assertEqual(1, 1)
