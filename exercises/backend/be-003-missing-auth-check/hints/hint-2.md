# Hint 2 (Medium)

You need two checks after authentication:

1. **Role check**: Only `admin` and `editor` roles should be able to delete. Return 403 for other roles.
2. **Ownership check**: Editors should only delete articles where `article.authorId === user.id`. Admins can delete anything.

The order matters: check the role first, then look up the article, then check ownership.
