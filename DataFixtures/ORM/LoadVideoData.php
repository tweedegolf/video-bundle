<?php

namespace TweedeGolf\VideoBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use TweedeGolf\VideoBundle\Entity\Video;

class LoadVideoData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * @var int
     */
    const FAKE_VIDEO_COUNT = 10;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var Generator
     */
    private $faker;

    /**
     * @var array
     */
    public $randomVideos = [
        'https://www.youtube.com/watch?v=zofBinqC2F4',
        'https://www.youtube.com/watch?v=H1iboKia3AQ',
        'https://www.youtube.com/watch?v=9lh_becOt4Y',
        'https://www.youtube.com/watch?v=6TwkVs6nhoY',
        'https://www.youtube.com/watch?v=Ukugbb0Y72M',
        'https://www.youtube.com/watch?v=6uhRxK_EOm4',
        'https://www.youtube.com/watch?v=IadsLclBOS8',
        'https://www.youtube.com/watch?v=A2_yg19Pu7Y',
        'https://www.youtube.com/watch?v=2eAdXwZjHNA',
        'https://www.youtube.com/watch?v=IvjMgVS6kng',
        'https://www.youtube.com/watch?v=THnQTYqoDzg',
    ];

    /**
     * LoadFileData constructor.
     */
    public function __construct()
    {
        $this->faker = Factory::create();
    }

    /**
     * {@inheritdoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < self::FAKE_VIDEO_COUNT; $i += 1) {
            $video = new Video();
            $video->setName($faker->text(15));
            $video->setDescription($faker->text(500));
            $video->setUrl($faker->randomElement($this->randomVideos));
            $this->addReference('video-'.$i, $video);
            $manager->persist($video);
        }

        $manager->flush();
    }

    /**
     * Load videos first.
     */
    public function getOrder()
    {
        return 2;
    }
}
