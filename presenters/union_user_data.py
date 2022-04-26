def union_user_data(data):
    users = {}
    for user_row in data:
        user_id = user_row["user_id"]
        if not user_id in users:
            users[user_id] = {}
        for key, value in user_row.items():
            value = value if value else ""
            if key in users[user_id]:
                if type(users[user_id][key]) == list:
                    if value not in users[user_id][key]:
                        users[user_id][key].append(value)
                else:
                    current_str = users[user_id][key]
                    if value != current_str:
                        users[user_id][key] = [value, current_str]
            else:
                users[user_id][key] = value
    users_list = []
    for user_id in users.keys():
        users_list.append(users[user_id])
    return users_list
