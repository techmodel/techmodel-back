class DBError(Exception):
    def __init__(self, error):
        # Call the base class constructor with the parameters it needs
        super().__init__(f"DBError: could not get data from db. error- {error}")