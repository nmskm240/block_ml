import { apiClient } from "@/lib/api";
import { List, ListItem } from "@mui/material";

export async function UserProjectList({ userId }: { userId: string }) {
  const user = await apiClient.getUser({ userId: userId });

  return (
    <div>
      <h1>{user.profile.name}'s Projects</h1>
      <List>
        {user.projectSummaries.map((project) => (
          <ListItem key={project.id}>
            <h2>{project.title}</h2>
            <p>Created at: {new Date(project.createdAt).toLocaleDateString()}</p>
            <p>Updated at: {new Date(project.updatedAt).toLocaleDateString()}</p>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
