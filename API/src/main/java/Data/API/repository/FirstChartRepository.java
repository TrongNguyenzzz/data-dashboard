package Data.API.repository;

import Data.API.model.FirstChart;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FirstChartRepository extends MongoRepository<FirstChart, ObjectId> {
    FirstChart findByCategory(String category);
}
