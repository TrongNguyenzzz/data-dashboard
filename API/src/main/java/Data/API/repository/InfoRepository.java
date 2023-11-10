package Data.API.repository;

import Data.API.model.Info;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InfoRepository extends MongoRepository<Info, ObjectId> {
    public Info findByName(String name);
}
