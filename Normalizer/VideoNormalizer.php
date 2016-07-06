<?php

namespace TweedeGolf\VideoBundle\Normalizer;

use Liip\ImagineBundle\Imagine\Cache\CacheManager;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use TweedeGolf\VideoBundle\Entity\Video;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class VideoNormalizer implements NormalizerInterface
{
    /**
     * @var CacheManager
     */
    private $cache_manager;

    /**
     * @var string
     */
    private $filter_name;

    /**
     * @var UploaderHelper
     */
    private $upload_helper;

    /**
     * FileNormalizer constructor.
     *
     * @param UploaderHelper $upload_helper
     * @param CacheManager   $cache_manager
     * @param string         $filter_name
     */
    public function __construct(CacheManager $cache_manager, $filter_name)
    {
        $this->cache_manager = $cache_manager;
        $this->filter_name = $filter_name;
    }

    /**
     * {@inheritdoc}
     */
    public function normalize($object, $format = null, array $context = array())
    {
        if ($object instanceof Video) {
            return [
                'id' => $object->getId(),
                'name' => $object->getName(),
                'description' => $object->getDescription(),
                'url' => $object->getUrl(),
                'thumbnail' => $object->getThumbnail(),
                'youtubeId' => $object->getYoutubeId(),
                'created' => $object->getCreatedAt()->format('d-m-Y H:i')
            ];
        }

        return null;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null)
    {
        return $data instanceof Video;
    }
}
