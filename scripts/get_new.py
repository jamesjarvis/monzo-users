from utils import get_new_count, add_value

if __name__ == "__main__":
    count = get_new_count()
    add_value('monzo_users.csv', count)