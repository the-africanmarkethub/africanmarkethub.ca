import { ArticleContent } from "@/components/vendor/vendor-support/article-content";
import { ArticleHeader } from "@/components/vendor/vendor-support/article-header";
import { TrainingTutorials } from "@/components/vendor/vendor-support/training-tutorials";

export default function TutorialPage() {
  return (
    <div className="space-y-6 p-6 xl:space-y-8 xl:p-8">
      <ArticleHeader />
      <ArticleContent />
      <div className="">
        <h2 className="font-semibold text-2xl mb-6">
          Related to the Tutorials
        </h2>
        <TrainingTutorials />
      </div>
    </div>
  );
}
