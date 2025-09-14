import { Button } from '@mui/material';

import { CreateProjectButton } from '@/features/createProject';

export default function IndexPage() {
return (
    <div className="global-page-padding">
      <CreateProjectButton/>
      <Button>マイページに移動</Button>
    </div>
  );
}
