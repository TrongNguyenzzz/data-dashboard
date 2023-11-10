package Data.API.model;

import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

@Document(collection = "data")
@Data
public class Info {
    @Id
    private ObjectId id;

    private String content;

    private String name;

    @Transient
    private MultipartFile multipartFile;

    @Transient
    private String command;

    public Info(String content) {
        this.content = content;
        this.name = name;
    }
}
