package Data.API.repository;

import Data.API.model.ChartDescription;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChartDescriptionRepository extends MongoRepository<ChartDescription, ObjectId> {
    ChartDescription findChartDescriptionByCategory (String category);
}
