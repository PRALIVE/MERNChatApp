import { Container} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/authorization/login";
import Signup from "../components/authorization/Signup";
import "../App.css";

function Homepage() {
  return (
    <div className="home">
      <Container maxW="xl" centerContent>
        <Box bg="white" w="100%" p={6} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>

            <TabPanels >
              <TabPanel >
                <Login />
              </TabPanel>
              <TabPanel >
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
}

export default Homepage;
