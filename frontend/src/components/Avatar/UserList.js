import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../Context/GlobalHooks";
const UserListItem = ({ handleFunction, user }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <div className="imageavatar">
          <div>
            <img className="imageavatar" src={user.pic} />
          </div>
      </div>
      <div>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </div>
    </Box>
  );
};

export default UserListItem;
