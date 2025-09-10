import { useListConversationsQuery } from '@/gql/graphql';

const useConversation = () => {
  const q = useListConversationsQuery({
    notifyOnNetworkStatusChange: true,
  });
  const items = q.data?.listConversations?.items ?? [];

  return { ...q, items };
};
export default useConversation;
