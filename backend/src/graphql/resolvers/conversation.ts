import { GraphQLContext } from "../../utils/types";

const resolvers = {
    Query:{},
    Mutation:{
        createConversation:async(_:any,args:{participantIds:Array<string>},context:GraphQLContext)=>{
            console.log('conversation resolver')
            console.log('args',args.participantIds)
        }
    }
}
export default resolvers;