import { AuthService } from "@/lib/auth";

const TestPage = async () => {
   const user = await AuthService.getCurrentUser();

   if (!user?.id) {
      return null
   }

   return ( 
      <div>
         {JSON.stringify(user)}
      </div>
    );
}
 
export default TestPage;