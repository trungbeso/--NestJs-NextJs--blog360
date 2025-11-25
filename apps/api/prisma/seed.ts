import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Hàm tạo slug từ tiêu đề
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Thay thế 1 hoặc nhiều khoảng trắng bằng dấu gạch ngang
    .replace(/[^\w-]+/g, '') // Xóa các ký tự không phải chữ, số, hoặc gạch ngang
    .substring(0, 100); // Giới hạn độ dài để an toàn
}

async function main() {
  console.log('🧹 Bắt đầu xóa dữ liệu cũ (Users, Posts)...');
  
  // Xóa toàn bộ dữ liệu cũ để tránh các khóa ngoại và chuẩn bị seed Users an toàn
  // Lưu ý: Chỉ nên làm trong môi trường Dev/Test!
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Đã xóa dữ liệu cũ.');

  // --- 1. Tạo Users ---
  const users = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
  }));

  // Tạo Users mới với createMany (vì email là unique, nên xóa cũ là cách đơn giản nhất)
  await prisma.user.createMany({
    data: users,
  });

  const createdUsers = await prisma.user.findMany({ select: { id: true } });
  const userIds = createdUsers.map(u => u.id);

  console.log(`👤 Đã tạo ${userIds.length} Users.`);

  // --- 2. Chuẩn bị Post Data ---
  const postsToSeed = Array.from({ length: 40 }).map(() => {
    const title = faker.lorem.sentence({ min: 5, max: 10 });
    return {
      title: title,
      slug: generateSlug(title), // Sửa lỗi: dùng biến 'title' vừa tạo
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlLoremFlickr(),
      // Chọn ngẫu nhiên 1 authorId từ danh sách đã tạo
      authorId: userIds[Math.floor(Math.random() * userIds.length)],
      published: true,
    };
  });

  // --- 3. Seed Posts bằng phương thức UPSERT ---
  console.log('📝 Bắt đầu seed Posts bằng UPSERT...');

  await Promise.all(
    postsToSeed.map(
      async (post) => {
        // Tạo comments mẫu cho bài viết này
        const commentsData = Array.from({ length: 20 }).map(() => ({
          content: faker.lorem.sentence(),
          // Chọn ngẫu nhiên 1 authorId cho comment
          authorId: userIds[Math.floor(Math.random() * userIds.length)],
        }));

        await prisma.post.upsert({
          where: {
            // Điều kiện duy nhất để tìm kiếm: slug
            slug: post.slug,
          },
          update: {
            // Nếu Post đã tồn tại, cập nhật các trường này
            title: post.title,
            content: post.content,
            thumbnail: post.thumbnail,
            // Không cập nhật comments ở đây để tránh tạo trùng lặp
          },
          create: {
            // Nếu Post chưa tồn tại, tạo mới cùng với comments lồng nhau
            ...post,
            comments: {
              createMany: {
                data: commentsData,
              },
            },
          },
        });
      }
    ),
  );

  console.log(`✅ Đã seed ${postsToSeed.length} Posts (sử dụng Upsert).`);
  console.log('🎉 Seeding completed.');
}

// Khối xử lý chính
main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Lỗi khi Seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });