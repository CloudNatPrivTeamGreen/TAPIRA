evolution = {
    "user_1.0.0_1.0.1": {
        "/register": {
            "is_removed": False,
            "POST": {
                "is_removed": False,
                "requestBody": {
                    "Register": {
                        "is_removed": False,
                        "old": {
                            "utilizer.name": None,
                            "utilizer.non_eu_country": None,
                            "utilizer.country": None,
                            "utilizer.direct_transfer": None,
                            "utilizer_category.name": None,
                            "utilizer_category.country": None,
                            "utilizer_category.non_eu_country": None,
                            "utilizer_category.type": None,
                            "utilizer_category.sector": None,
                            "retention-time.months": None,
                            "retention-time.review_frequency.days": None,
                            "profiling.reason": None,
                            "spacial_category.category": None
                        },
                        "new": {
                            "utilizer.name": "GCloud",
                            "utilizer.non_eu_country": True,
                            "utilizer.country": "USA",
                            "utilizer.direct_transfer": False,
                            "utilizer_category.name": "GCloud",
                            "utilizer_category.country": "USA",
                            "utilizer_category.non_eu_country": False,
                            "utilizer_category.type": "Cloud Provider",
                            "utilizer_category.sector": "Cybersecurity",
                            "retention-time.months": 6,
                            "retention-time.review_frequency.days": 3,
                            "profiling.reason": "Customer profile based on bought products",
                            "spacial_category.category": "Identity and Access Management"
                        }
                    }
                }
            }
        }
    },
    "user_1.0.1_1.0.2": {
        "/register": {
            "is_removed": False,
            "POST": {
                "is_removed": False,
                "requestBody": {
                    "Register": {
                        "is_removed": False,
                        "old": {
                            "retention-time.months": 6
                        },
                        "new": {
                            "retention-time.months": 10
                        }
                    }
                }
            }
        }
    }
}

reports = [
    {
        "report": {
            "purposes": {
                "Marketing": "30",
                "Health": "24",
                "Sports": "13",
                "Payment": "10",
                "IAM": "8"
            },
            "utilizers": {
                "Brazil": {
                    "utilizer_values": {
                        "Lidl": 43,
                        "Otto": 40,
                        "Rewe": 17
                    },
                    "sum": 31
                },
                "USA": {
                    "utilizer_values": {
                        "Walmart": 50,
                        "Tesco": 27,
                        "Nike": 23
                    },
                    "sum": 24
                },
                "Australia": {
                    "utilizer_values": None,
                    "sum": 20
                },
                "EU": {
                    "utilizer_values": None,
                    "sum": 10
                },
                "Mexico": {
                    "utilizer_values": {},
                    "sum": 5
                }
            },
            "profiling": None
        },
        "services": {
            "carts": "1.2.0",
            "catalogue": "1.1.1"
        },
        "timestamp": "01-01-2022/16:44"
    },
    {
        "report": {
            "purposes": None,
            "utilizers": None,
            "profiling": None
        },
        "services": {
            "carts": "1.2.0",
            "catalogue": "1.1.1"
        },
        "timestamp": "01-01-2022/16:44"
    }]
